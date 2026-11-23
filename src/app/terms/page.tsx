import type { Metadata } from "next";
import { LegalContent } from "@/components/legal-content";
import { POLICY_VERSION, termsSections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of the Trinity Mall website and enquiry forms.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalContent
      kicker={{ ar: "الشروط", en: "TERMS" }}
      title={{ ar: "شروط الاستخدام.", en: "Terms of Use." }}
      version={POLICY_VERSION}
      sections={termsSections}
    />
  );
}
