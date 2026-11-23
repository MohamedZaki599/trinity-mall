import { lt } from "drizzle-orm";
import { connection } from "next/server";
import { getDb } from "@/db";
import { enquiries, rateLimitBuckets } from "@/db/schema";
import { DATA_RETENTION_MONTHS } from "@/content/legal";
import { env } from "@/lib/env";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  await connection();

  const secret = env().CRON_SECRET;
  if (!secret) return new Response("Cron is not configured", { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = getDb();
  const retentionCutoff = new Date();
  retentionCutoff.setMonth(retentionCutoff.getMonth() - DATA_RETENTION_MONTHS);

  const deleted = await db
    .delete(enquiries)
    .where(lt(enquiries.createdAt, retentionCutoff))
    .returning({ id: enquiries.id });

  const bucketCutoff = new Date(Date.now() - 2 * DAY_MS);
  await db.delete(rateLimitBuckets).where(lt(rateLimitBuckets.windowStart, bucketCutoff));

  return Response.json({ deletedEnquiries: deleted.length });
}
