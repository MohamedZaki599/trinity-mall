import "server-only";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { rateLimitBuckets } from "@/db/schema";

export type RateLimitRule = { key: string; limit: number; windowMs: number };

// Fixed windows kept in Postgres so serverless instances share one counter.
export async function isRateLimited(rules: RateLimitRule[]): Promise<boolean> {
  const db = getDb();
  let limited = false;

  for (const rule of rules) {
    const windowStart = new Date(Math.floor(Date.now() / rule.windowMs) * rule.windowMs);
    const [row] = await db
      .insert(rateLimitBuckets)
      .values({ bucketKey: rule.key, windowStart, count: 1 })
      .onConflictDoUpdate({
        target: [rateLimitBuckets.bucketKey, rateLimitBuckets.windowStart],
        set: { count: sql`${rateLimitBuckets.count} + 1` },
      })
      .returning({ count: rateLimitBuckets.count });

    if ((row?.count ?? 0) > rule.limit) limited = true;
  }

  return limited;
}
