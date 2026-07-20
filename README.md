# Norishé — Website & Management Platform

Premium healthy meal delivery website for the Nigerian market, built with Next.js 14 (App Router),
TypeScript, Tailwind CSS, Prisma, and NextAuth. Includes the full public marketing site, a 9-step
enrollment wizard, and a secured admin dashboard for managing enrollments, leads, plans/pricing,
menu, testimonials, delivery schedules, and analytics.

## 1. Requirements

- Node.js 18.18+ (Node 20 LTS recommended)
- npm 9+
- A database: SQLite for local development (no setup needed), PostgreSQL for production

## 2. Setup

```bash
npm install
cp .env.example .env      # then fill in the values described below
npx prisma generate       # downloads the Prisma query engine (needs normal internet access)
npx prisma migrate dev --name init
npm run seed               # creates the admin account + seeds plans, testimonials, menu items
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the admin
dashboard.

> **Note:** `npx prisma generate` downloads a platform-specific query engine binary from
> `binaries.prisma.sh`. This requires normal outbound internet access. If you're behind a
> restrictive proxy/firewall, allow that host (or generate the client on an unrestricted machine
> and commit `node_modules/.prisma` — not recommended long-term, but works in a pinch).

### First admin login

The seed script creates one admin account using `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from
your `.env` (defaults: `admin@norishe.vip` / `Norishe#Admin2026`). The seed script prints the
credentials to the console — **change the password immediately**. On first login, the admin panel
forces a password change before you can access anything else.

## 3. Environment Variables

All variables live in `.env.example` — copy it to `.env` and fill in real values before deploying.

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | SQLite path locally (`file:./dev.db`), Postgres connection string in production |
| `NEXTAUTH_URL` | Yes | Full base URL of the deployed site (e.g. `https://norishe.vip`) |
| `NEXTAUTH_SECRET` | Yes | Random 32+ byte string — generate with `openssl rand -base64 32` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Yes (seed only) | Initial admin account credentials |
| `RESEND_API_KEY` | No | If set, transactional email sends via [Resend](https://resend.com) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_SECURE` | No | Alternative to Resend — sends via any SMTP provider |
| `EMAIL_FROM` | No | From address for outgoing email |
| `ADMIN_NOTIFICATION_EMAIL` | No | Where new-enrollment/lead notifications are sent (defaults to `hello@norishe.vip`) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` / `PAYSTACK_SECRET_KEY` | No | Enables card payment via Paystack (see §6) |
| `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | No | Optional third-party analytics — first-party analytics works without these |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL, used for metadata, sitemap, and JSON-LD |

If email variables are left blank, outgoing emails are simply logged to the server console instead
of failing — safe for local development.

## 4. Switching to PostgreSQL for Production

1. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql" // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL` to your Postgres connection string (Vercel Postgres, Supabase, Neon, Railway, etc. all work).
3. Run `npx prisma migrate deploy` against the new database, then `npm run seed`.

## 5. Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. Add all environment variables from `.env.example` in the Vercel project settings.
4. Set the Vercel Postgres (or your own Postgres) connection string as `DATABASE_URL`.
5. Add a `postinstall` build step is already configured (`prisma generate` runs automatically).
6. After the first deploy, run `npx prisma migrate deploy` and `npm run seed` against production
   (via `vercel env pull` + local run, or a one-off Vercel CLI command).

## 6. Payments (Paystack)

Paystack integration is feature-flagged: if `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` and
`PAYSTACK_SECRET_KEY` are unset (the default), plan pages and the enrollment flow present clear
"Pay via Bank Transfer / Pay on Delivery" instructions instead. Once you're ready to accept card
payments, set both keys and wire up the Paystack Inline/Popup SDK at the point of enrollment
confirmation — the `Subscription.paymentStatus` field (`PAID` / `TRANSFER_PENDING` / `ON_DELIVERY`)
is already modeled to support this.

## 7. Managing Content Without Touching Code

Everything the business owner needs to change day-to-day lives in `/admin`:

- **Prices & meal plans** — `/admin/plans`: edit plan copy, toggle plans active/inactive, toggle
  the "Most Popular" ribbon, and add/edit/delete subscription tiers (meals/week, billing cadence,
  price in Naira). Changes reflect immediately on `/plans` and `/plans/[slug]`.
- **Menu & gallery** — `/admin/menu`: add dishes with an image URL, calories, protein, and plan
  tags; delete dishes that are no longer served.
- **Testimonials** — `/admin/testimonials`: add real client testimonials, hide/show any
  testimonial, or delete the seeded placeholders.
- **Contact info & WhatsApp** — `/admin/settings`: phone, email, WhatsApp number, Instagram
  handle, street address, delivery-area note, and an optional site-wide announcement banner. These
  feed the Contact page, Footer, header WhatsApp button, and legal pages automatically.
- **Site copy** — `/admin/content`: every other piece of marketing copy — homepage hero, problem/
  promise section, experience strip quote, lead magnet, final CTA, corporate teaser, About page
  intro/mission/vision, How It Works closing note, and the Corporate page hero/form intro — grouped
  by page with a one-click "reset to default" per field. No code change ever required to update
  wording.
- **FAQ** — `/admin/faq`: add, edit, reorder (via `order`), hide/show, or delete FAQ entries shown
  on `/faq`.
- **Enrollments** — `/admin/enrollments`: full 9-section submission detail, status pipeline
  (New → Contacted → Plan Sent → Active → Paused → Churned), internal notes, and CSV export.
- **Leads** — `/admin/leads`: newsletter signups, contact form messages, corporate inquiries, and
  exit-intent captures, all filterable and exportable.
- **Delivery schedule** — `/admin/delivery`: printable weekly grid of active subscriptions by
  delivery day.
- **Analytics** — `/admin/analytics`: first-party page view and CTA click counts, no third-party
  trackers required.

Legal pages (`/legal/privacy`, `/legal/terms`) also pull the contact email/phone from
`/admin/settings` rather than hardcoding them.

## 8. Project Structure

```
src/app/                  Public routes (App Router) + /admin dashboard + /api route handlers
src/components/           Shared UI, section components, admin components, enrollment wizard
src/lib/                  Prisma client, auth config, email service, validation schemas,
                           data-access layer (with static-content fallback), server actions
prisma/schema.prisma      Full data model (Enrollment, Lead, Plan, PlanTier, MenuItem,
                           Testimonial, Subscription, Settings, SiteContent, FaqItem,
                           AnalyticsEvent, AuditLog, AdminUser)
prisma/seed.ts            Seeds the admin account, six meal plans + tiers, testimonials, menu items
public/images/            Brand photography extracted from the supplied brand profile PDF
assets/raw/               Original extracted images (logo pages, unprocessed photography) — not
                           used directly by the site, kept for reference/future asset work
```

## 9. Data Resilience

Public pages read through `src/lib/data.ts`, which tries Prisma first and gracefully falls back to
static, seed-equivalent content (`src/lib/plans-content.ts`, `src/lib/static-content.ts`) if the
database isn't reachable yet. This means the public marketing site renders correctly even before
your first migration — useful for previewing the site during setup. Once the database is migrated
and seeded, all content is admin-editable and served from Postgres/SQLite as normal. Note this
fallback does **not** apply to enrollment/lead submission or any admin mutation — those always
require a working database connection.

## 10. Known Limitations / Follow-Ups

See `DECISIONS.md` for the full list of assumptions made during the build, and the handover
summary (shared alongside this repo) for every placeholder the owner should replace before launch
(prices, testimonials, real dish photography, lead-magnet PDF).
