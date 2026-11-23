import type { Metadata } from "next";
import { connection } from "next/server";

// Admin routes must block on the session so redirects carry a real status code.
export const instant = false;

export const metadata: Metadata = {
  title: "Lead desk",
  robots: { index: false, follow: false },
};

// Admin pages depend on the session, and redirects need a real status code.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return children;
}
