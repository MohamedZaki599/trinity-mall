import { and, count, desc, eq, ilike, isNull, or, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { enquiries, enquiryStatuses, type EnquiryStatus } from "@/db/schema";
import { LeadDashboard, type LeadRow } from "@/components/lead-dashboard";
import { requireAdmin } from "@/lib/auth/session";

const PAGE_SIZE = 25;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  await requireAdmin("/admin/leads");
  const db = getDb();
  const params = await searchParams;

  const status =
    typeof params.status === "string" &&
    (enquiryStatuses as readonly string[]).includes(params.status)
      ? (params.status as EnquiryStatus)
      : "";
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";
  const requestedPage = Number.parseInt(typeof params.page === "string" ? params.page : "1", 10);
  const page = Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1);

  const filters: SQL[] = [isNull(enquiries.deletedAt)];
  if (status) filters.push(eq(enquiries.status, status));
  if (query) {
    const search = or(
      ilike(enquiries.name, `%${query}%`),
      ilike(enquiries.phoneE164, `%${query}%`),
      ilike(enquiries.email, `%${query}%`),
    );
    if (search) filters.push(search);
  }
  const where = and(...filters);

  const [totalRow, statusCounts, demoRow, records] = await Promise.all([
    db.select({ value: count() }).from(enquiries).where(where),
    db
      .select({ status: enquiries.status, value: count() })
      .from(enquiries)
      .where(isNull(enquiries.deletedAt))
      .groupBy(enquiries.status),
    db
      .select({ value: count() })
      .from(enquiries)
      .where(and(isNull(enquiries.deletedAt), eq(enquiries.isDemo, true))),
    db
      .select({
        id: enquiries.id,
        name: enquiries.name,
        phoneE164: enquiries.phoneE164,
        email: enquiries.email,
        category: enquiries.category,
        business: enquiries.business,
        areaSqm: enquiries.areaSqm,
        source: enquiries.source,
        status: enquiries.status,
        isDemo: enquiries.isDemo,
        createdAt: enquiries.createdAt,
      })
      .from(enquiries)
      .where(where)
      .orderBy(desc(enquiries.createdAt))
      .offset((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE),
  ]);

  const total = totalRow[0]?.value ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const counts: Record<string, number> = {};
  for (const item of statusCounts) counts[item.status] = item.value;

  const rows: LeadRow[] = records.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phoneE164,
    email: row.email,
    category: row.category,
    business: row.business,
    areaSqm: row.areaSqm,
    source: row.source,
    status: row.status,
    isDemo: row.isDemo,
    createdAt: row.createdAt.toISOString(),
  }));

  return (
    <main className="inner-page dashboard-page">
      <LeadDashboard
        rows={rows}
        counts={counts}
        total={total}
        page={page}
        pages={pages}
        status={status}
        query={query}
        hasDemo={(demoRow[0]?.value ?? 0) > 0}
      />
    </main>
  );
}
