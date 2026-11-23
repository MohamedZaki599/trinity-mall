import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { neon } = require("@neondatabase/serverless");

if (process.env.SEED_DEMO_DATA !== "true") {
  console.log("SEED_DEMO_DATA is not true; nothing to do.");
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const [{ count }] = await sql`select count(*)::int as count from enquiries where is_demo = true`;
if (count > 0) {
  console.log(`Demo rows already present (${count}); skipping.`);
  process.exit(0);
}

const demo = [
  ["Nour Retail (demo)", "+201000000001", "lease", "Retail", 120, "new"],
  ["Alfa Group (demo)", "+201000000002", "corporate", "Branch expansion", 250, "contacted"],
  ["Mona Office (demo)", "+201000000003", "buy", "Professional services", 150, "visit_scheduled"],
];

for (const [name, phone, category, business, area, status] of demo) {
  await sql`
    insert into enquiries
      (name, phone_e164, category, business, area_sqm, locale, source, status, is_demo, consent_at, consent_policy_version)
    values
      (${name}, ${phone}, ${category}, ${business}, ${area}, 'ar', 'demo seed', ${status}, true, now(), '1.0')
  `;
}

console.log(`Inserted ${demo.length} demo rows.`);
