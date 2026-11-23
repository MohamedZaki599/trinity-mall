import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { ADMIN_SESSION_MAX_AGE, SESSION_COOKIE, type AdminSession } from "@/lib/auth/types";

export { SESSION_COOKIE, type AdminSession };

function options(): SessionOptions {
  return {
    password: env().SESSION_SECRET,
    cookieName: SESSION_COOKIE,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    },
  };
}

export async function getSession() {
  return getIronSession<AdminSession>(await cookies(), options());
}

// Authoritative check for pages. Proxy is only an optimistic redirect.
export async function requireAdmin(nextPath = "/admin/leads"): Promise<{ email: string }> {
  const session = await getSession();
  if (!session.admin) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }
  return session.admin;
}

// Authoritative check for server actions; never redirects a mutation.
export async function assertAdmin(): Promise<
  { ok: true; email: string } | { ok: false }
> {
  const session = await getSession();
  return session.admin ? { ok: true, email: session.admin.email } : { ok: false };
}

export function safeAdminPath(value: string | null | undefined, fallback = "/admin/leads"): string {
  if (!value) return fallback;
  if (!value.startsWith("/admin")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
