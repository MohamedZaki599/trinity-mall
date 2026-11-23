import "server-only";
import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.url(),
  DATABASE_URL_UNPOOLED: z.url().optional(),
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD_HASH: z.string().min(20),
  SESSION_SECRET: z.string().min(32),
  IP_HASH_SECRET: z.string().min(16),
  RESEND_API_KEY: z.string().min(10),
  LEAD_NOTIFICATION_TO: z.email(),
  LEAD_NOTIFICATION_FROM: z.string().min(3),
  CRON_SECRET: z.string().min(16).optional(),
  SEED_DEMO_DATA: z.enum(["true", "false"]).optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

// Validated lazily so `next build` works without production secrets present.
export function env(): ServerEnv {
  if (cached) return cached;

  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid or missing environment variables: ${fields}`);
  }

  cached = parsed.data;
  return cached;
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
