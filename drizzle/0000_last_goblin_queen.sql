CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid,
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"from_status" text,
	"to_status" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"phone_e164" text NOT NULL,
	"email" text,
	"category" text NOT NULL,
	"business" text,
	"area_sqm" integer,
	"message" text,
	"locale" text DEFAULT 'ar' NOT NULL,
	"source" text DEFAULT 'website' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"consent_at" timestamp with time zone NOT NULL,
	"consent_policy_version" text NOT NULL,
	"ip_hash" text,
	"user_agent" text,
	"email_sent_at" timestamp with time zone,
	"email_error" text,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "enquiries_category_check" CHECK ("enquiries"."category" in ('buy', 'lease', 'corporate', 'general')),
	CONSTRAINT "enquiries_status_check" CHECK ("enquiries"."status" in ('new', 'contacted', 'visit_scheduled', 'negotiation', 'closed')),
	CONSTRAINT "enquiries_locale_check" CHECK ("enquiries"."locale" in ('ar', 'en')),
	CONSTRAINT "enquiries_phone_check" CHECK ("enquiries"."phone_e164" ~ '^\+201[0125][0-9]{8}$'),
	CONSTRAINT "enquiries_area_check" CHECK ("enquiries"."area_sqm" is null or ("enquiries"."area_sqm" > 0 and "enquiries"."area_sqm" < 100000))
);
--> statement-breakpoint
CREATE TABLE "rate_limit_buckets" (
	"bucket_key" text NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "rate_limit_buckets_bucket_key_window_start_pk" PRIMARY KEY("bucket_key","window_start")
);
--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_events_enquiry_created_idx" ON "audit_events" USING btree ("enquiry_id","created_at");--> statement-breakpoint
CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "enquiries_status_created_at_idx" ON "enquiries" USING btree ("status","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "enquiries_phone_idx" ON "enquiries" USING btree ("phone_e164");--> statement-breakpoint
CREATE INDEX "enquiries_ip_created_at_idx" ON "enquiries" USING btree ("ip_hash","created_at");