"use client";

import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/components/language-provider";
import type { MallUnit } from "@/content/project";

export function UnitDetail({ unit }: { unit: MallUnit }) {
  const { tr } = useLanguage();

  return (
    <>
      <SiteHeader />
      <main className="inner-page unit-detail-v2" id="main">
        <span className="kicker">
          {tr("مسار توضيحي", "ILLUSTRATIVE ROUTE")} · {unit.offerType}
        </span>
        <div className="detail-hero">
          <figure>
            <Image
              src={unit.image}
              alt={unit.imageAlt}
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
            <figcaption>
              {tr("صورة توضيحية من مواد المشروع", "Illustrative image from supplied project material")}
            </figcaption>
          </figure>
          <div>
            <span className="detail-number">0{unit.id.at(-1)}</span>
            <h1>{tr(unit.title.replace("Sample ", "مساحة توضيحية: "), unit.title)}</h1>
            <p>
              {tr(
                "هذا المثال يوضح كيف يمكن ترتيب المعلومات قبل طلب التفاصيل المعتمدة من فريق Trinity Mall.",
                "This example demonstrates how information can be structured before requesting management-approved details from the Trinity Mall team.",
              )}
            </p>
            <dl>
              <div>
                <dt>{tr("نوع الفرصة", "Opportunity")}</dt>
                <dd>{unit.offerType}</dd>
              </div>
              <div>
                <dt>{tr("نوع المساحة", "Space type")}</dt>
                <dd>{unit.unitType}</dd>
              </div>
              <div>
                <dt>{tr("مساحة توضيحية", "Illustrative area")}</dt>
                <dd>{unit.areaSqm} m²</dd>
              </div>
              <div>
                <dt>{tr("ملائم لـ", "Suitable for")}</dt>
                <dd>{unit.intendedUses.join(" · ")}</dd>
              </div>
            </dl>
            <div className="detail-note">
              {tr(
                "بيانات تجريبية فقط — لا تمثل إتاحة فعلية أو عرضًا تجاريًا أو شروطًا معتمدة.",
                "Demo data only — not actual availability, a commercial offer or approved terms.",
              )}
            </div>
            <Link className="button button-gold" href="/contact">
              {tr("اطلب معلومات معتمدة", "Request approved information")} <span>↗</span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
