import type { Metadata } from "next";
import "./globals.css";
import "./overrides.css";
import { LanguageProvider } from "@/components/language-provider";
export const metadata: Metadata = { title: { default: "Trinity Mall | Digital Leasing MVP", template: "%s | Trinity Mall" }, description: "A demonstration MVP for Trinity Mall sales, leasing and corporate enquiries.", openGraph: { title: "Trinity Mall | Digital Leasing MVP", description: "Sales, leasing and corporate enquiry demonstration." } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ar" dir="rtl" data-scroll-behavior="smooth"><body><LanguageProvider>{children}</LanguageProvider></body></html>; }
