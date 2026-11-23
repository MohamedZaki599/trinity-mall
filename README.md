# Trinity Mall — Digital Leasing

Lead capture and enquiry management for Trinity Mall, New Assiut City: commercial sales, leasing and corporate partnerships, with a protected internal lead desk.

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · TypeScript (strict)
- Tailwind CSS 4
- Neon Postgres + Drizzle ORM
- Server Actions for form submission (CSRF-protected, progressive enhancement)
- iron-session (encrypted cookie) + argon2 password hashing
- Resend for lead notification email

## Local setup

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local`:

1. `DATABASE_URL` — pooled Neon connection string.
2. `DATABASE_URL_UNPOOLED` — direct connection for migrations.
3. `ADMIN_EMAIL`.
4. `ADMIN_PASSWORD_HASH` — generate it:
   ```bash
   npm run hash-password -- "your-password"
   ```
5. `SESSION_SECRET` and `IP_HASH_SECRET` — random strings (32+ and 16+ characters).
6. Resend keys and the notification inbox.
7. `NEXT_PUBLIC_SITE_URL` — no trailing slash.

Create the schema and start:

```bash
npm run db:migrate
npm run dev
```

Generate a new migration after editing `src/db/schema.ts`:

```bash
npm run db:generate
npm run db:migrate
```

Optional demo rows (never in production):

```bash
SEED_DEMO_DATA=true npm run seed:demo
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page and enquiry capture |
| `/units` | Illustrative catalogue (sample data) |
| `/units/[slug]` | Illustrative unit detail |
| `/corporate-partners` | Corporate enquiry route |
| `/contact` | Full enquiry form |
| `/privacy`, `/terms` | Legal pages |
| `/admin/login` | Team sign-in |
| `/admin/leads` | Lead desk (session required) |
| `/api/admin/export` | CSV export (session required) |
| `/api/cron/retention` | 24-month retention cleanup (Bearer `CRON_SECRET`) |

## How leads flow

1. The visitor submits the form; a Server Action validates it server-side.
2. Honeypot + timing checks and Postgres-backed rate limits reject abuse.
3. The enquiry is written to Postgres with consent timestamp and policy version.
4. `after()` sends a Resend notification. Email failure never loses the lead; the error is recorded on the row.
5. The team sees it in `/admin/leads`, changes status, and can export CSV.

Raw IPs are never stored: only `HMAC-SHA256(IP_HASH_SECRET, ip)`.

## Security notes

- Every admin page and mutation re-checks the session server-side. `proxy.ts` only performs an optimistic redirect and is not the security boundary.
- Session cookie: HTTP-only, Secure in production, SameSite=Lax, 8-hour expiry.
- Login is rate limited per IP and per email.
- CSV cells beginning with `= + - @` are escaped against formula injection.
- Security headers are set in `next.config.ts`. CSP ships as `Content-Security-Policy-Report-Only` first because enforcing it would require nonces that break Cache Components.

## Deploy (Vercel + Neon)

Full step-by-step runbook in Arabic: [DEPLOYMENT.md](DEPLOYMENT.md).

1. Create a Neon project and copy the pooled and direct URLs.
2. Add every key from `.env.example` in Vercel for Production, Preview and Development.
3. Run `npm run db:migrate` against the production direct URL.
4. Deploy. `vercel.json` schedules the retention cron; set `CRON_SECRET` so Vercel signs the request.
5. Resend: until a sending domain is verified, `onboarding@resend.dev` delivers only to the Resend account owner. Verify a domain and update `LEAD_NOTIFICATION_FROM` before relying on team-wide notifications.

## Before public launch

Code is ready; these content and account items are not:

- Replace `[LEGAL ENTITY NAME]`, `[COMMERCIAL REGISTRATION NO.]`, `[REGISTERED ADDRESS]` and `[PRIVACY CONTACT EMAIL]` in `src/content/legal.ts`.
- Confirm the official public sales/leasing phone number (kept out of the UI until approved).
- Approve construction status, handover, floors, areas, availability and commercial terms.
- Verify the Resend domain and set the final notification inbox.
- Point `NEXT_PUBLIC_SITE_URL` at the final domain.

## Known limits (Phase 1)

- No automated test suite or CI yet.
- The hero image is 2.1 MB and several pages are client-rendered; performance work is deferred.
- Language is stored client-side, not in the URL, so there are no per-language canonical URLs yet.
- JSON-LD structured data is not included.
