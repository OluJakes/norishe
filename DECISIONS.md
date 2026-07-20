# Decisions & Assumptions

This document records every decision made during the build where the brief left the choice open,
plus known environment limitations encountered while building in a sandboxed environment.

## Brand & Content

- **Brand assets**: Logo wordmark, leaf mark, and food/packaging photography were extracted
  directly from the supplied `norishe' profile.pdf` and `Norishe' printables.pdf` using `pdfimages`
  / `pdftoppm`, then cropped and optimized into `public/images/`. The header/footer logo is
  rendered as live text (Playfair Display "Norishé" + a hand-built SVG leaf mark) rather than a
  raster image, so it stays crisp at every size/resolution and can recolor correctly on both light
  and dark backgrounds — the extracted raster lockup (`public/images/norishe-logo-lockup.png`) is
  kept as a brand asset for reference/print use.
- **Meal plan copy**: Used verbatim from the brief for names, taglines, descriptions, and "Perfect
  For" lists. Sample weekly menus and nutrition philosophy blurbs were newly written (clearly
  editorial, not fabricated nutrition claims) to fill out each plan detail page, since the brief
  didn't supply specific weekly menus for every plan.
- **Testimonials**: Six placeholder testimonials were written as realistic examples, explicitly
  labeled in the UI as illustrative and editable from `/admin/testimonials`. No real client names
  or quotes were fabricated as if genuine.
- **Pricing**: All Naira prices are seeded placeholders, flagged with `// TODO: owner sets real
  prices in admin` in code and "Prices shown are starting estimates" copy on plan pages. Real
  pricing must be set in `/admin/plans` before launch.
- **Location & delivery zones**: Norishé is based at 15 Kainji Crescent, off Lake Chad Crescent,
  Maitama, Abuja, Nigeria — this address is used on the Contact page, footer, and the
  `LocalBusiness` JSON-LD schema in `src/app/layout.tsx`. Delivery-area copy across
  FAQ/Contact/metadata says "Abuja, with select zones in other major Nigerian cities" — update
  once real delivery coverage is finalized.

## Technical Decisions

- **Fonts loaded via `<link>` tag, not `next/font/google`**: `next/font` downloads font files at
  *build time*. In restricted network environments (like this sandbox, and potentially some CI
  setups) that call can fail the build. Loading Playfair Display + Poppins via a standard Google
  Fonts `<link>` in `<head>` avoids any build-time network dependency — fonts load client-side like
  any normal website. If you prefer self-hosted fonts for privacy/performance, switching to
  `next/font/google` is a small, isolated change in `src/app/layout.tsx`.
- **Data-access resilience layer** (`src/lib/data.ts`): Public pages try Prisma first and fall back
  to static, seed-equivalent content if the database is unreachable. This was added so the site
  never shows a broken/empty page during initial setup, and as defense-in-depth against transient
  DB issues. Mutations (enrollment submission, lead capture, all admin writes) always require a
  real database — there is no static fallback for writes.
- **Admin mutations via Next.js Server Actions** (`src/lib/actions/admin.ts`) rather than a REST
  API for every CRUD operation. This keeps the admin dashboard's data flow simpler and colocated,
  while public-facing writes (enrollment, leads, analytics) use conventional `POST` API routes so
  they're easy to call from any client, including future non-Next.js clients.
- **Corporate inquiries** create a `Lead` with `type: CORPORATE` and a `meta` JSON field carrying
  the estimated headcount, per the brief's requirement, rather than a separate database table —
  keeps the Lead model unified and simple to query/export/filter in `/admin/leads`.
- **Health data**: `Enrollment` health-profile fields are stored as plain text columns rather than
  a separate encrypted-at-rest table, because true field-level encryption requires a KMS/secrets
  setup that depends on the hosting provider. The privacy notice on the Health Profile wizard step
  and the Privacy Policy both flag this. Before going live with real client health data, add
  column-level or transparent database encryption appropriate to your Postgres host (e.g. Vercel
  Postgres/Neon support encryption at rest by default; consider additional field-level encryption
  if required for your compliance posture) and restrict `/admin/enrollments` access to trusted
  staff only (already enforced via NextAuth + middleware).
- **Analytics**: First-party only by default (own `AnalyticsEvent` table, logged via
  `POST /api/analytics`, viewable in `/admin/analytics`). `NEXT_PUBLIC_GA4_ID` and
  `NEXT_PUBLIC_META_PIXEL_ID` env vars are documented and reserved but not wired to any script tag
  — add them in `src/app/layout.tsx` if/when third-party tracking is desired.
- **Paystack**: Left feature-flagged/unwired per the brief ("phase-ready, not blocking"). With keys
  absent, the enrollment flow and plan pages present bank-transfer/pay-on-delivery instructions.
  `Subscription.paymentStatus` already models `PAID` / `TRANSFER_PENDING` / `ON_DELIVERY` so wiring
  in the Paystack Inline SDK later is additive, not a schema change.

## Environment Limitations Encountered While Building

These are specific to the sandboxed build environment used to produce this repository and **do
not** affect the code's correctness on a normal machine, CI runner, or Vercel:

- `npx prisma generate` could not download its query-engine binary from `binaries.prisma.sh`
  because the sandbox's network egress is allowlisted and that host wasn't reachable. The Prisma
  schema, migrations, and every query in the codebase are written normally and will work as soon as
  `prisma generate` runs somewhere with standard internet access (any developer machine, CI, or
  Vercel build). All application code was still verified with `tsc --noEmit` (clean, zero errors)
  using a local type-only shim, and the Next.js production build compiled and began static-page
  collection successfully before hitting the expected stub-client boundary.
- A production `next build` could not be run to full completion inside the sandbox for the same
  reason (no real Prisma client available at build time) combined with the sandbox's per-command
  time limits. Run `npm run build` yourself after `npx prisma generate` to produce the final
  optimized build — this is a standard step for any Next.js + Prisma project and isn't specific to
  this codebase.
- Lighthouse audits (Performance/Accessibility/Best Practices/SEO ≥ 90 target) could not be
  executed inside this sandbox, which has no headless Chrome. The site was built with that budget
  in mind throughout (semantic HTML, `next/image` with lazy loading below the fold, minimal
  JavaScript on first paint, WCAG AA-checked color pairings — see below), but you should run
  Lighthouse yourself (Chrome DevTools or `npx lighthouse`) on the deployed site as a final check.
- Color contrast: gold (`#C9A24B`) is used on dark forest-green backgrounds (passes AA comfortably)
  and as small accent text on cream; body copy is always charcoal (`#232323`) on cream/ivory, which
  passes AA. Gold-on-cream is avoided for body text and used only for large display type, icons,
  and short labels, per the brief's WCAG AA callout.

## Deferred / Simplified for Time

- The **Subscriptions/Orders** admin surface has server actions (`createSubscription`,
  `updateSubscriptionPayment`) and a delivery-schedule view, but no dedicated "create subscription"
  form UI yet — subscriptions are intended to be created once an enrollment is confirmed as ACTIVE.
  Wiring a small form into the enrollment detail page (`/admin/enrollments/[id]`) to call
  `createSubscription` is the natural next step.
- **Image uploads** in the Menu Manager accept an image URL rather than a direct file-upload
  widget. For a fully self-serve experience, wire in a storage provider (Vercel Blob, S3,
  Cloudinary) and swap the URL field for an upload control.
- **Rate limiting** on the admin login route is not implemented at the application layer; NextAuth
  handles credential validation, but for production hardening, add IP-based rate limiting (e.g. via
  Vercel's Edge Middleware + a KV store, or a service like Upstash) to `/api/auth/callback/credentials`.

## Schema Update: SiteContent, FaqItem, Settings.address/deliveryNote

If you already ran `npx prisma db push` against your MySQL database on cPanel before receiving this
version, your database is missing two new tables (`SiteContent`, `FaqItem`) and two new columns on
`Settings` (`address`, `deliveryNote`). Before deploying this version, re-run on the server:

```
npx prisma generate
npx prisma db push
npm run seed   # safe to re-run — upserts, never overwrites existing admin edits
```

`db push` will add the missing tables/columns without touching existing enrollment/lead/plan data.
The seed script's `SiteContent` and `FaqItem` seeding uses `upsert` with an empty `update: {}`, so
it will never clobber content you've already edited in `/admin/content` or `/admin/faq`.
