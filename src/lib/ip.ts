import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { env } from "@/lib/env";

export function hashIp(ip: string): string {
  return createHmac("sha256", env().IP_HASH_SECRET).update(ip).digest("hex");
}

export async function requestIpHash(): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || requestHeaders.get("x-real-ip") || "unknown";
  return hashIp(ip);
}
