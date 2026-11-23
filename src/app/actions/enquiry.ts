"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { after } from "next/server";
import { getDb } from "@/db";
import { auditEvents, enquiries } from "@/db/schema";
import { POLICY_VERSION } from "@/content/legal";
import { sendLeadEmail } from "@/lib/email";
import { requestIpHash } from "@/lib/ip";
import type { EnquiryState } from "@/lib/leads/state";
import { isRateLimited } from "@/lib/rate-limit";
import { parseEnquiryInput } from "@/lib/validation/enquiry";

const TEN_MINUTES = 10 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  // Bots fill hidden fields; drop silently so they do not learn the rule.
  if (field(formData, "company_website")) return { status: "success", id: "ignored" };

  const renderedAt = Number(field(formData, "rendered_at"));
  if (Number.isFinite(renderedAt) && renderedAt > 0) {
    const age = Date.now() - renderedAt;
    if (age < 2000 || age > 2 * ONE_HOUR) {
      return { status: "error", fields: {}, form: "SPAM_REJECTED" };
    }
  }

  const parsed = parseEnquiryInput({
    name: field(formData, "name"),
    phone: field(formData, "phone"),
    email: field(formData, "email"),
    category: field(formData, "category"),
    business: field(formData, "business"),
    area: field(formData, "area"),
    message: field(formData, "message"),
    locale: field(formData, "locale"),
    consent: field(formData, "consent"),
  });

  if (!parsed.ok) return { status: "error", fields: parsed.fields };

  const requestHeaders = await headers();
  const ipHash = await requestIpHash();

  const db = getDb();

  try {
    const limited = await isRateLimited([
      { key: `enquiry:ip:${ipHash}`, limit: 5, windowMs: TEN_MINUTES },
      { key: `enquiry:ipday:${ipHash}`, limit: 30, windowMs: ONE_DAY },
      { key: `enquiry:phone:${parsed.value.phoneE164}`, limit: 3, windowMs: ONE_HOUR },
    ]);

    if (limited) return { status: "error", fields: {}, form: "RATE_LIMITED" };

    const createdAt = new Date();
    const [inserted] = await db
      .insert(enquiries)
      .values({
        name: parsed.value.name,
        phoneE164: parsed.value.phoneE164,
        email: parsed.value.email,
        category: parsed.value.category,
        business: parsed.value.business,
        areaSqm: parsed.value.areaSqm,
        message: parsed.value.message,
        locale: parsed.value.locale,
        source: "website",
        consentAt: createdAt,
        consentPolicyVersion: POLICY_VERSION,
        ipHash,
        userAgent: requestHeaders.get("user-agent")?.slice(0, 300) ?? null,
      })
      .returning({ id: enquiries.id });

    if (!inserted) throw new Error("Enquiry insert returned no row");

    await db.insert(auditEvents).values({
      enquiryId: inserted.id,
      actor: "visitor",
      action: "enquiry.created",
      toStatus: "new",
      metadata: { source: "website", locale: parsed.value.locale },
    });

    after(async () => {
      try {
        await sendLeadEmail({
          id: inserted.id,
          ...parsed.value,
          createdAt,
        });
        await db
          .update(enquiries)
          .set({ emailSentAt: new Date(), emailError: null })
          .where(eq(enquiries.id, inserted.id));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown email error";
        await db
          .update(enquiries)
          .set({ emailError: message.slice(0, 500) })
          .where(eq(enquiries.id, inserted.id));
      }
    });

    return { status: "success", id: inserted.id };
  } catch (error) {
    console.error("enquiry_submission_failed", error);
    return { status: "error", fields: {}, form: "SERVER_ERROR" };
  }
}
