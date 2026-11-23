"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { auditEvents, enquiries, enquiryStatuses } from "@/db/schema";
import { assertAdmin } from "@/lib/auth/session";

const statusSchema = z.enum(enquiryStatuses);

export async function updateLeadStatus(
  id: string,
  status: string,
): Promise<{ ok: boolean }> {
  const auth = await assertAdmin();
  if (!auth.ok) return { ok: false };

  const db = getDb();
  const parsedId = z.uuid().safeParse(id);
  const parsedStatus = statusSchema.safeParse(status);
  if (!parsedId.success || !parsedStatus.success) return { ok: false };

  const [current] = await db
    .select({ status: enquiries.status })
    .from(enquiries)
    .where(eq(enquiries.id, parsedId.data))
    .limit(1);

  if (!current) return { ok: false };

  await db
    .update(enquiries)
    .set({ status: parsedStatus.data })
    .where(eq(enquiries.id, parsedId.data));

  await db.insert(auditEvents).values({
    enquiryId: parsedId.data,
    actor: auth.email,
    action: "enquiry.status_changed",
    fromStatus: current.status,
    toStatus: parsedStatus.data,
  });

  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function deleteLead(formData: FormData): Promise<void> {
  const auth = await assertAdmin();
  if (!auth.ok) return;

  const db = getDb();
  const parsed = z.uuid().safeParse(String(formData.get("id") ?? ""));
  if (!parsed.success) return;

  const [current] = await db
    .select({ status: enquiries.status })
    .from(enquiries)
    .where(eq(enquiries.id, parsed.data))
    .limit(1);

  if (!current) return;

  await db
    .update(enquiries)
    .set({ deletedAt: new Date() })
    .where(eq(enquiries.id, parsed.data));

  await db.insert(auditEvents).values({
    enquiryId: parsed.data,
    actor: auth.email,
    action: "enquiry.deleted",
    fromStatus: current.status,
  });

  revalidatePath("/admin/leads");
}

export async function removeDemoLeads(): Promise<void> {
  const auth = await assertAdmin();
  if (!auth.ok) return;

  const db = getDb();
  await db.delete(enquiries).where(eq(enquiries.isDemo, true));
  await db.insert(auditEvents).values({
    actor: auth.email,
    action: "enquiry.demo_removed",
  });

  revalidatePath("/admin/leads");
}
