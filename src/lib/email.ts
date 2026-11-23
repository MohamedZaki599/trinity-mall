import "server-only";
import { Resend } from "resend";
import { env } from "@/lib/env";
import type { EnquiryCategory, EnquiryLocale } from "@/db/schema";

export type LeadEmail = {
  id: string;
  name: string;
  phoneE164: string;
  email: string | null;
  category: EnquiryCategory;
  business: string | null;
  areaSqm: number | null;
  message: string | null;
  locale: EnquiryLocale;
  createdAt: Date;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string | null): string {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px 6px 0;color:#6b7280">${escapeHtml(label)}</td><td style="padding:6px 0"><strong>${escapeHtml(value)}</strong></td></tr>`;
}

export async function sendLeadEmail(lead: LeadEmail): Promise<void> {
  const { RESEND_API_KEY, LEAD_NOTIFICATION_FROM, LEAD_NOTIFICATION_TO } = env();
  const resend = new Resend(RESEND_API_KEY);
  const safeName = lead.name.replace(/[\r\n]+/g, " ");

  const html = `<div style="font-family:Arial,sans-serif;color:#111827">
  <h2 style="margin:0 0 12px">New ${escapeHtml(lead.category)} enquiry</h2>
  <table style="border-collapse:collapse;font-size:14px">
    ${row("Name", lead.name)}
    ${row("Phone", lead.phoneE164)}
    ${row("Email", lead.email)}
    ${row("Business", lead.business)}
    ${row("Area", lead.areaSqm ? `${lead.areaSqm} m²` : null)}
    ${row("Language", lead.locale)}
    ${row("Received", lead.createdAt.toISOString())}
  </table>
  ${lead.message ? `<p style="white-space:pre-wrap;margin:16px 0;padding:12px;background:#f3f4f6;border-radius:6px">${escapeHtml(lead.message)}</p>` : ""}
  <p style="color:#6b7280;font-size:12px">Lead ID: ${escapeHtml(lead.id)}</p>
</div>`;

  const { error } = await resend.emails.send({
    from: LEAD_NOTIFICATION_FROM,
    to: LEAD_NOTIFICATION_TO,
    subject: `New ${lead.category} enquiry — ${safeName}`,
    html,
  });

  if (error) throw new Error(error.message);
}
