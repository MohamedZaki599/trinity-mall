import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { safeAdminPath } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Team sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const next = safeAdminPath(typeof params.next === "string" ? params.next : undefined);

  return (
    <main className="inner-page" id="main">
      <LoginForm next={next} />
    </main>
  );
}
