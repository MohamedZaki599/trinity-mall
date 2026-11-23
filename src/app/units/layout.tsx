import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spaces",
  description:
    "Explore illustrative commercial and administrative spaces at Trinity Mall. Availability and terms are confirmed by the Trinity Mall team.",
  alternates: { canonical: "/units" },
};

export default function UnitsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
