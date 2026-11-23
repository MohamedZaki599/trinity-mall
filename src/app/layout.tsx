import type { Metadata } from "next";
import "./globals.css";
import "./overrides.css";
import "./production.css";
import { LanguageProvider } from "@/components/language-provider";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Trinity Mall | Sales, Leasing & Partnerships",
    template: "%s | Trinity Mall",
  },
  description:
    "Commercial and administrative spaces for sale or lease at Trinity Mall, New Assiut City, with a dedicated corporate partnership route.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Trinity Mall",
    title: "Trinity Mall | Sales, Leasing & Partnerships",
    description:
      "Commercial and administrative spaces for sale or lease at Trinity Mall, New Assiut City.",
    url: "/",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trinity Mall | Sales, Leasing & Partnerships",
    description:
      "Commercial and administrative spaces for sale or lease at Trinity Mall, New Assiut City.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          تخطَّ إلى المحتوى / Skip to content
        </a>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
