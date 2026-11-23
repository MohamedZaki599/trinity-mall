"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function SiteFooter() { const { tr } = useLanguage(); return <footer className="site-footer"><div><p className="footer-mark">TRINITY MALL</p><p>{tr("منصة توضيحية لاستقبال وتنظيم الاستفسارات — ليست موقعًا تشغيليًا أو نظام إدارة إنتاجيًا.", "A demonstration platform for enquiry capture and organisation — not an operational website or production CRM.")}</p></div><div className="footer-links"><Link href="/contact">{tr("استفسار", "Enquire")}</Link><Link href="/admin/leads">{tr("لوحة العملاء — Demo", "Lead desk — Demo")}</Link><span>© 2026</span></div></footer>; }
