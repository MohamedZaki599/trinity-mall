import type { Metadata } from "next";
import { LegalContent } from "@/components/legal-content";
import { POLICY_VERSION, privacySections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Trinity Mall collects, uses and retains enquiry data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalContent
      kicker={{ ar: "الخصوصية", en: "PRIVACY" }}
      title={{ ar: "سياسة الخصوصية.", en: "Privacy Policy." }}
      version={POLICY_VERSION}
      sections={privacySections}
    />
  );
}
