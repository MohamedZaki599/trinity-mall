"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/components/language-provider";
import type { LegalSection } from "@/content/legal";

export function LegalContent({
  kicker,
  title,
  version,
  sections,
}: {
  kicker: { ar: string; en: string };
  title: { ar: string; en: string };
  version: string;
  sections: LegalSection[];
}) {
  const { tr, isArabic } = useLanguage();

  return (
    <>
      <SiteHeader />
      <main className="inner-page legal-page" id="main">
        <section className="contact-intro">
          <span>01</span>
          <div>
            <p className="kicker">{isArabic ? kicker.ar : kicker.en}</p>
            <h1>{isArabic ? title.ar : title.en}</h1>
            <p>
              {tr("النسخة", "Version")} {version}
            </p>
          </div>
        </section>

        <div className="legal-body">
          {sections.map((section, index) => (
            <article key={section.title.en}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{isArabic ? section.title.ar : section.title.en}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.en}>{isArabic ? paragraph.ar : paragraph.en}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
