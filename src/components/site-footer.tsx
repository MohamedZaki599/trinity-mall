"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { tr } = useLanguage();

  return (
    <footer className="site-footer">
      <div>
        <p className="footer-mark">TRINITY MALL</p>
        <p>
          {tr(
            "منصة رقمية لاستقبال وتنظيم استفسارات البيع والتأجير والشراكات.",
            "A digital platform for capturing and organising sales, leasing and partnership enquiries.",
          )}
        </p>
      </div>
      <div className="footer-links">
        <Link href="/contact">{tr("استفسار", "Enquire")}</Link>
        <Link href="/privacy">{tr("الخصوصية", "Privacy")}</Link>
        <Link href="/terms">{tr("الشروط", "Terms")}</Link>
        <span>© 2026</span>
      </div>
    </footer>
  );
}
