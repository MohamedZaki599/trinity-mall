import { desc, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { enquiries } from "@/db/schema";
import { assertAdmin } from "@/lib/auth/session";

function csvCell(value: unknown): string {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  if (/[",\r\n]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

export async function GET() {
  const auth = await assertAdmin();
  if (!auth.ok) return new Response("Unauthorized", { status: 401 });

  const db = getDb();
  const rows = await db
    .select()
    .from(enquiries)
    .where(isNull(enquiries.deletedAt))
    .orderBy(desc(enquiries.createdAt));

  const header = [
    "id",
    "created_at",
    "name",
    "phone",
    "email",
    "category",
    "business",
    "area_sqm",
    "message",
    "locale",
    "status",
    "is_demo",
    "consent_at",
    "consent_version",
  ];

  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.id,
        row.createdAt.toISOString(),
        row.name,
        row.phoneE164,
        row.email,
        row.category,
        row.business,
        row.areaSqm,
        row.message,
        row.locale,
        row.status,
        row.isDemo,
        row.consentAt.toISOString(),
        row.consentPolicyVersion,
      ]
        .map(csvCell)
        .join(","),
    ),
  ];

  const filename = `trinity-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(`﻿${lines.join("\r\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
