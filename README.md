# Trinity Mall — Digital Leasing MVP

An interview prototype for Trinity Mall, New Assiut City. It demonstrates a premium digital enquiry path for commercial sales, leasing and corporate partnerships. It is not a production property-management system.

## Run locally

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Routes

- `/` — landing page, published facts and local enquiry capture
- `/units` — filterable catalogue using visible sample data only
- `/units/[slug]` — illustrative unit details
- `/corporate-partners` — corporate enquiry journey
- `/contact` — complete local-only enquiry form
- `/admin/leads` — locally persisted demo lead dashboard

## Demo boundaries

Submissions are stored only in browser `localStorage`; no CRM, email, SMS, network request or public contact channel is used. The catalogue is sample data, deliberately labelled as such. The dashboard's seeded names and phone numbers are fictional.

The source of published claims and their approval status is centralised in `src/content/project.ts`. Management must confirm current construction and operating status, inventory, areas, commercial terms, amenities, official contact channel, map pin, permits and any published offers before public launch.

## Assets

`public/assets/` contains the supplied logo, architectural visualizations, progress photo and interior reference photo. Captions distinguish visualizations from photos and do not imply current readiness or signed tenants.

## Future production work

Add management-approved content, authentication and authorisation for the dashboard, server-side lead storage, consent/privacy controls, audit history, CRM integration, monitored validation and approved contact channels.
