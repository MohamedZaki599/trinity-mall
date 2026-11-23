import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";
import * as schema from "./schema";

function createClient() {
  return drizzle(neon(env().DATABASE_URL), { schema });
}

let cached: ReturnType<typeof createClient> | null = null;

// Initialised on first query so builds do not require database secrets.
export function getDb() {
  if (!cached) cached = createClient();
  return cached;
}
