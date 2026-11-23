import "server-only";
import { verify } from "@node-rs/argon2";
import { env } from "@/lib/env";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;
  try {
    return await verify(env().ADMIN_PASSWORD_HASH, password);
  } catch {
    return false;
  }
}
