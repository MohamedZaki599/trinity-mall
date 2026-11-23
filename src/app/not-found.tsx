"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/components/language-provider";

export default function NotFound() {
  const { tr } = useLanguage();

  return (
    <>
      <SiteHeader />
      <main className="inner-page error-page" id="main">
        <p className="kicker">404</p>
        <h1>{tr("هذه الصفحة غير متاحة.", "This page is unavailable.")}</h1>
        <p>
          {tr(
            "قد يكون الرابط قديمًا أو مكتوبًا بشكل غير صحيح.",
            "The link may be outdated or mistyped.",
          )}
        </p>
        <div className="error-actions">
          <Link className="button button-gold" href="/">
            {tr("العودة للرئيسية", "Back to home")}
          </Link>
          <Link className="text-cta" href="/units">
            {tr("استكشف المساحات", "Explore spaces")} <span>←</span>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
