"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function SiteHeader() {
  const { locale, setLocale, tr } = useLanguage();
  return <header className="site-header"><Link className="brand" href="/" aria-label="Trinity Mall home"><Image src="/assets/00-trinity-mall-gold-logo.png" alt="Trinity Mall logo" width={48} height={48} priority /><span><strong>TRINITY MALL</strong><small>{tr("مدينة أسيوط الجديدة", "NEW ASSIUT CITY")}</small></span></Link><nav aria-label={tr("التنقل الرئيسي", "Main navigation")}><Link href="/#opportunities">{tr("الفرص", "Opportunities")}</Link><Link href="/units">{tr("استكشف المساحات", "Explore spaces")}</Link><Link href="/corporate-partners">{tr("شراكات الشركات", "Corporate")}</Link><Link href="/admin/leads" className="nav-demo">{tr("لوحة العملاء", "Lead desk")} <em>Demo</em></Link></nav><div className="header-actions"><button className="lang-switch" onClick={() => setLocale(locale === "ar" ? "en" : "ar")} aria-label={tr("التبديل إلى الإنجليزية", "Switch to Arabic")}>{locale === "ar" ? "EN" : "ع"}</button><Link className="button button-gold" href="/contact">{tr("ابدأ استفسارك", "Start enquiry")} <span>↗</span></Link></div></header>;
}
