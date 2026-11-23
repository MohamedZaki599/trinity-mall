import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enquire",
  description:
    "Send a sales, leasing or partnership enquiry to the Trinity Mall team, or request approved information.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
