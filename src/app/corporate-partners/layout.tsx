import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate partnerships",
  description:
    "A dedicated corporate route for banks, telecom operators, brands and food and beverage operators considering Trinity Mall.",
  alternates: { canonical: "/corporate-partners" },
};

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
