import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const enquiryCategories = ["buy", "lease", "corporate", "general"] as const;
export const enquiryStatuses = [
  "new",
  "contacted",
  "visit_scheduled",
  "negotiation",
  "closed",
] as const;
export const enquiryLocales = ["ar", "en"] as const;

export type EnquiryCategory = (typeof enquiryCategories)[number];
export type EnquiryStatus = (typeof enquiryStatuses)[number];
export type EnquiryLocale = (typeof enquiryLocales)[number];

export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    name: text("name").notNull(),
    phoneE164: text("phone_e164").notNull(),
    email: text("email"),
    category: text("category").$type<EnquiryCategory>().notNull(),
    business: text("business"),
    areaSqm: integer("area_sqm"),
    message: text("message"),
    locale: text("locale").$type<EnquiryLocale>().notNull().default("ar"),
    source: text("source").notNull().default("website"),
    status: text("status").$type<EnquiryStatus>().notNull().default("new"),
    isDemo: boolean("is_demo").notNull().default(false),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    consentPolicyVersion: text("consent_policy_version").notNull(),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    emailSentAt: timestamp("email_sent_at", { withTimezone: true }),
    emailError: text("email_error"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("enquiries_created_at_idx").on(table.createdAt.desc()),
    index("enquiries_status_created_at_idx").on(table.status, table.createdAt.desc()),
    index("enquiries_phone_idx").on(table.phoneE164),
    index("enquiries_ip_created_at_idx").on(table.ipHash, table.createdAt),
    check(
      "enquiries_category_check",
      sql`${table.category} in ('buy', 'lease', 'corporate', 'general')`,
    ),
    check(
      "enquiries_status_check",
      sql`${table.status} in ('new', 'contacted', 'visit_scheduled', 'negotiation', 'closed')`,
    ),
    check("enquiries_locale_check", sql`${table.locale} in ('ar', 'en')`),
    check("enquiries_phone_check", sql`${table.phoneE164} ~ '^\\+201[0125][0-9]{8}$'`),
    check(
      "enquiries_area_check",
      sql`${table.areaSqm} is null or (${table.areaSqm} > 0 and ${table.areaSqm} < 100000)`,
    ),
  ],
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enquiryId: uuid("enquiry_id").references(() => enquiries.id, { onDelete: "set null" }),
    actor: text("actor").notNull(),
    action: text("action").notNull(),
    fromStatus: text("from_status"),
    toStatus: text("to_status"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("audit_events_enquiry_created_idx").on(table.enquiryId, table.createdAt)],
);

export const rateLimitBuckets = pgTable(
  "rate_limit_buckets",
  {
    bucketKey: text("bucket_key").notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    count: integer("count").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.bucketKey, table.windowStart] })],
);
