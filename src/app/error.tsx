"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/components/language-provider";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const { tr } = useLanguage();

  useEffect(() => {
    console.error("route_error", error);
  }, [error]);

  return (
    <>
      <SiteHeader />
      <main className="inner-page error-page" id="main">
        <p className="kicker">{tr("خطأ", "ERROR")}</p>
        <h1>{tr("حدث خطأ غير متوقع.", "Something went wrong.")}</h1>
        <p>
          {tr(
            "جرّب المحاولة مرة أخرى، وإذا استمرت المشكلة تواصل معنا.",
            "Try again, and if the problem continues please contact us.",
          )}
        </p>
        <div className="error-actions">
          <button className="button button-gold" type="button" onClick={() => retry()}>
            {tr("حاول مرة أخرى", "Try again")}
          </button>
          <Link className="text-cta" href="/">
            {tr("العودة للرئيسية", "Back to home")}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
