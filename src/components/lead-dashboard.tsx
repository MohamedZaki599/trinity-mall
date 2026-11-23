"use client";

import { deleteLead, removeDemoLeads } from "@/app/actions/admin";
import { logout } from "@/app/admin/login/actions";
import { StatusSelect } from "@/components/admin/status-select";
import { useLanguage } from "@/components/language-provider";

export type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  category: string;
  business: string | null;
  areaSqm: number | null;
  source: string;
  status: string;
  isDemo: boolean;
  createdAt: string;
};

export type LeadDashboardProps = {
  rows: LeadRow[];
  counts: Record<string, number>;
  total: number;
  page: number;
  pages: number;
  status: string;
  query: string;
  hasDemo: boolean;
};

const statuses = ["new", "contacted", "visit_scheduled", "negotiation", "closed"] as const;

export function LeadDashboard({
  rows,
  counts,
  total,
  page,
  pages,
  status,
  query,
  hasDemo,
}: LeadDashboardProps) {
  const { tr } = useLanguage();

  const statusText = (value: string) =>
    ({
      new: tr("جديد", "New"),
      contacted: tr("تم التواصل", "Contacted"),
      visit_scheduled: tr("زيارة محددة", "Visit scheduled"),
      negotiation: tr("تفاوض", "Negotiation"),
      closed: tr("مغلق", "Closed"),
    })[value] ?? value;

  const labels = statuses.map((value) => ({ value, label: statusText(value) }));
  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (query) params.set("q", query);
    if (target > 1) params.set("page", String(target));
    const suffix = params.toString();
    return suffix ? `/admin/leads?${suffix}` : "/admin/leads";
  };

  return (
    <>
      <section className="dashboard-hero">
        <div>
          <p className="kicker">LEAD DESK</p>
          <h1>{tr("متابعة كل استفسار\nحتى الخطوة التالية.", "Every enquiry,\nthrough to the next step.")}</h1>
          <p>
            {tr(
              "استفسارات حقيقية محفوظة في قاعدة البيانات، مع سجل تغييرات للحالة.",
              "Real enquiries stored in the database, with an audit trail for status changes.",
            )}
          </p>
        </div>
        <div className="lead-meter">
          <span>{total}</span>
          <p>{tr("إجمالي الاستفسارات", "total enquiries")}</p>
        </div>
      </section>

      <div className="funnel">
        <div className="funnel-line" />
        {statuses.slice(0, 4).map((value) => (
          <div key={value}>
            <b>{counts[value] ?? 0}</b>
            <span>{statusText(value)}</span>
          </div>
        ))}
      </div>

      <div className="lead-toolbar">
        <form method="get" className="lead-filters">
          <label>
            {tr("ابحث", "Search")}
            <input name="q" defaultValue={query} placeholder={tr("اسم، هاتف، بريد", "Name, phone or email")} />
          </label>
          <label>
            {tr("الحالة", "Status")}
            <select name="status" defaultValue={status}>
              <option value="">{tr("الكل", "All")}</option>
              {labels.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="button button-outline" type="submit">
            {tr("تطبيق", "Apply")}
          </button>
          <a className="text-cta" href="/admin/leads">
            {tr("إعادة ضبط", "Reset")}
          </a>
        </form>
        <div className="lead-toolbar-actions">
          <a className="text-cta" href="/api/admin/export">
            {tr("تصدير CSV", "Export CSV")}
          </a>
          <form action={logout}>
            <button className="text-cta" type="submit">
              {tr("خروج", "Sign out")}
            </button>
          </form>
        </div>
      </div>

      {hasDemo && (
        <div className="demo-banner">
          <p>
            {tr(
              "توجد صفوف تجريبية مميزة بشارة Demo.",
              "Demo rows are present and labelled with a Demo badge.",
            )}
          </p>
          <form action={removeDemoLeads}>
            <button className="text-cta" type="submit">
              {tr("إزالة البيانات التجريبية", "Remove demo rows")}
            </button>
          </form>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="empty-state">
          <h2>{tr("لا توجد استفسارات بعد.", "No enquiries yet.")}</h2>
          <p>
            {tr(
              "ستظهر الاستفسارات هنا بمجرد إرسالها من الموقع.",
              "Enquiries appear here as soon as they are submitted on the site.",
            )}
          </p>
        </div>
      ) : (
        <div className="lead-table-wrap">
          <table>
            <thead>
              <tr>
                <th>{tr("العميل", "Lead")}</th>
                <th>{tr("الاهتمام", "Interest")}</th>
                <th>{tr("المصدر", "Source")}</th>
                <th>{tr("الحالة", "Status")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <strong>
                      {lead.name} {lead.isDemo && <em className="demo-badge">Demo</em>}
                    </strong>
                    <span>{lead.phone}</span>
                    {lead.email && <span>{lead.email}</span>}
                  </td>
                  <td>
                    <b>{lead.category}</b>
                    <span>
                      {lead.business || "—"}
                      {lead.areaSqm ? ` · ${lead.areaSqm} m²` : ""}
                    </span>
                  </td>
                  <td>
                    {lead.source}
                    <span>{lead.createdAt.slice(0, 10)}</span>
                  </td>
                  <td>
                    <StatusSelect id={lead.id} status={lead.status} labels={labels} />
                  </td>
                  <td>
                    <form
                      action={deleteLead}
                      onSubmit={(event) => {
                        if (!window.confirm(tr("حذف هذا الاستفسار؟", "Delete this enquiry?"))) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={lead.id} />
                      <button className="row-delete" type="submit">
                        {tr("حذف", "Delete")}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav className="pagination" aria-label={tr("ترقيم الصفحات", "Pagination")}>
          {page > 1 ? (
            <a href={pageHref(page - 1)}>{tr("السابق", "Previous")}</a>
          ) : (
            <span />
          )}
          <span>
            {page} / {pages}
          </span>
          {page < pages ? <a href={pageHref(page + 1)}>{tr("التالي", "Next")}</a> : <span />}
        </nav>
      )}
    </>
  );
}
