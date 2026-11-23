"use server";

import { redirect } from "next/navigation";
import { verifyAdminPassword } from "@/lib/auth/password";
import { getSession, safeAdminPath } from "@/lib/auth/session";
import { env } from "@/lib/env";
import { requestIpHash } from "@/lib/ip";
import { isRateLimited } from "@/lib/rate-limit";

export type LoginState = { error?: string };

const FIFTEEN_MINUTES = 15 * 60 * 1000;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeAdminPath(String(formData.get("next") ?? ""));

  const ipHash = await requestIpHash();
  const limited = await isRateLimited([
    { key: `login:ip:${ipHash}`, limit: 5, windowMs: FIFTEEN_MINUTES },
    { key: `login:email:${email || "empty"}`, limit: 5, windowMs: FIFTEEN_MINUTES },
  ]);

  if (limited) {
    await delay(400);
    return { error: "RATE_LIMITED" };
  }

  const emailMatches = email === env().ADMIN_EMAIL.toLowerCase();
  const passwordMatches = await verifyAdminPassword(password);

  if (!emailMatches || !passwordMatches) {
    await delay(400);
    return { error: "INVALID_CREDENTIALS" };
  }

  const session = await getSession();
  session.admin = { email: env().ADMIN_EMAIL, loggedInAt: Date.now() };
  await session.save();

  redirect(next);
}

export async function logout(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
