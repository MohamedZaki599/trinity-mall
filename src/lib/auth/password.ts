import "server-only";
import { verify } from "@node-rs/argon2";
import { env } from "@/lib/env";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;
  try {
    return await verify(env().ADMIN_PASSWORD_HASH, password);
  } catch (error) {
    // Distinguishes a malformed hash from a wrong password in the runtime logs.
    console.error("admin_password_verify_failed", error instanceof Error ? error.message : "unknown");
    return false;
  }
}
