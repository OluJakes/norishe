# Deploying Norishé to cPanel (with a Namecheap domain)

This guide assumes your cPanel hosting plan includes **"Setup Node.js App"** (a.k.a. Node.js
Selector, powered by Phusion Passenger) — look for that icon under the **Software** section of
cPanel. If you don't see it, your plan is likely PHP/static-only and can't run this app; contact
your host about upgrading, or deploy to Vercel instead (much simpler for Next.js, and free for
this scale — ask me if you'd rather go that route).

## Overview of what you're doing

1. Point your Namecheap domain at your cPanel server.
2. Choose a production database (SQLite is fine to start; MySQL is recommended long-term).
3. Upload the code to your hosting account.
4. Create a Node.js App in cPanel pointing at this project.
5. Install dependencies, build, migrate, and seed.
6. Start the app and enable SSL.

---

## Step 1 — Point your Namecheap domain to your host

You're choosing between two approaches — pick one:

**Option A: Use your host's nameservers (simplest, recommended)**
1. In cPanel, find your account's nameservers — check your hosting welcome email, or look in
   cPanel under **Domains → Nameservers**, or ask your host's support.
2. Log into [namecheap.com](https://namecheap.com) → **Domain List** → click **Manage** next to
   your domain → **Nameservers** → choose **Custom DNS** → enter your host's nameservers (usually
   two, like `ns1.yourhost.com` / `ns2.yourhost.com`).
3. Save. DNS propagation can take anywhere from a few minutes to 24 hours.

**Option B: Keep Namecheap DNS, just point the A record**
1. In cPanel, find your server's shared/dedicated IP address (**General Information** panel on
   the cPanel home screen, or **Domains**).
2. In Namecheap → **Domain List** → **Manage** → **Advanced DNS**, add:
   - `A Record`, host `@`, value = your server IP, TTL Automatic
   - `A Record` (or `CNAME`), host `www`, value = your server IP (or `@` if using CNAME)
3. Save. Same propagation wait applies.

If this domain isn't already added as your cPanel account's primary domain, also add it in cPanel
under **Domains → Create A New Domain** (as an Addon Domain if you have other sites on this
account).

---

## Step 2 — Choose your database

This project defaults to **SQLite** (`DATABASE_URL="file:./dev.db"`), which works fine on cPanel
since your Node app runs as a persistent process (unlike serverless platforms). It's the fastest
way to get live. Two things to know:
- Back up `dev.db` periodically (cPanel → **Backup Wizard**, or just download the file via File
  Manager occasionally) — it's a single file with all your data.
- Under real concurrent traffic, SQLite's write-locking is a limitation. For a production
  business site, switching to MySQL is worth the extra 10 minutes — cPanel makes this easy since
  MySQL is built in.

**If you'd rather use MySQL** (recommended once you're past testing):

1. In cPanel → **MySQL® Databases**: create a database (e.g. `norishe`), a database user, and add
   that user to the database with **All Privileges**. Note the full names cPanel gives you — it
   prefixes both with your cPanel username, e.g. `cpaneluser_norishe` and `cpaneluser_dbuser`.
2. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "mysql" // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL` (in Step 6 below) to:
   ```
   mysql://cpaneluser_dbuser:YOUR_DB_PASSWORD@localhost:3306/cpaneluser_norishe
   ```

Either way, the rest of this guide is identical — just adjust `DATABASE_URL` and (if using MySQL)
the schema `provider` field.

---

## Step 3 — Upload the code

Pick whichever is easiest for you:

**Option A: File Manager (simplest, no terminal needed)**
1. Zip your project folder locally (make sure `node_modules` and `.next` are **not** included —
   they'll be created fresh on the server).
2. cPanel → **File Manager** → navigate to where you want the app (commonly outside
   `public_html`, e.g. create a folder called `norishe-app` in your home directory — Node apps on
   cPanel don't need to live in `public_html`, the Node.js App tool handles routing).
3. Upload the zip, then **Extract** it there.

**Option B: Git (if your host offers cPanel's Git Version Control)**
1. Push this project to a GitHub/GitLab repo first (from your own machine).
2. cPanel → **Git™ Version Control** → **Create** → paste your repo URL → set the deployment path
   to something like `/home/cpaneluser/norishe-app`.
3. Click **Manage** → **Pull or Deploy** whenever you push new commits.

**Option C: SSH** (if your host provides SSH access)
```bash
cd ~
git clone <your-repo-url> norishe-app
# or: scp/rsync the zipped project up, then unzip
```

---

## Step 4 — Create the Node.js App in cPanel

1. cPanel → **Setup Node.js App** → **Create Application**.
2. Fill in:
   - **Node.js version**: pick the highest available 18.x or 20.x (this project needs Node 18.18+).
   - **Application mode**: `Production`
   - **Application root**: the folder you uploaded to, e.g. `norishe-app`
   - **Application URL**: select your domain (and leave the path blank to serve from the root)
   - **Application startup file**: `server.js` (this is the custom entry point included in the
     project specifically for Passenger — see `server.js` at the project root)
3. Click **Create**. cPanel will show you an "Enter to the virtual environment" command — note the
   path, you may need it later for manual commands via SSH.

---

## Step 5 — Set environment variables

Still on the Node.js App page for this application, scroll to **Environment Variables** and add
each of these (values from your `.env.example` — see the main `README.md` for what each one
does):

| Name | Value |
|---|---|
| `DATABASE_URL` | `file:./dev.db` (SQLite) or your MySQL URL from Step 2 |
| `NEXTAUTH_URL` | `https://yourdomain.com` (your real domain, with `https://`) |
| `NEXTAUTH_SECRET` | Generate one — see below |
| `SEED_ADMIN_EMAIL` | Your real admin email |
| `SEED_ADMIN_PASSWORD` | A strong password — change it after first login regardless |
| `ADMIN_NOTIFICATION_EMAIL` | Where you want enrollment/lead alerts sent |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `RESEND_API_KEY` or `SMTP_*` | Optional — leave blank to skip real email sending for now |
| `NODE_ENV` | `production` |

To generate a real `NEXTAUTH_SECRET`, run this on any machine with a terminal (your own laptop is
fine) and paste the result in:
```bash
openssl rand -base64 32
```

Click **Save** after adding all variables.

---

## Step 6 — Install dependencies, build, and set up the database

Use the **"Run NPM Install"** button on the Node.js App page — this installs everything and runs
`prisma generate` automatically (via the `postinstall` script).

Then you need a terminal to run the build and database setup commands. cPanel's Node.js App page
gives you a command to enter the app's virtual environment via SSH — something like:
```bash
source /home/cpaneluser/nodevenv/norishe-app/18/bin/activate && cd /home/cpaneluser/norishe-app
```
(Exact path shown on your Node.js App page — copy it from there.) If you don't have SSH access,
check whether your host offers a **Terminal** app in cPanel itself (many do).

Once you're in that environment, run:
```bash
npm run build
npx prisma db push
npm run seed
```

`npm run build` compiles the production bundle. `prisma db push` creates your database tables
(SQLite file or MySQL tables, whichever you configured). `npm run seed` creates your admin account
and seeds the six meal plans, testimonials, and menu items — **note the admin email/password it
prints**, then change the password on first login.

---

## Step 7 — Start the app

Back on the **Setup Node.js App** page, click **Restart**. Give it a few seconds, then visit your
domain. You should see the Norishé homepage.

If it doesn't load, check the **Errors** section on the Node.js App page, or the app's log file
(path is shown on that page) — it'll show the same kind of Node.js error output you'd see in a
local terminal.

---

## Step 8 — Enable SSL (HTTPS)

cPanel → **SSL/TLS Status** (or a **Let's Encrypt™ SSL** icon, depending on your host) → select
your domain → **Run AutoSSL** (or **Issue**). This is usually free and automatic. Once issued,
double-check `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` both use `https://`, then **Restart** the
Node app again from the Node.js App page so it picks up the change.

---

## Step 9 — Verify everything works

- [ ] Homepage loads at `https://yourdomain.com`
- [ ] `/plans`, `/enroll`, `/contact`, etc. all load
- [ ] Submitting the enrollment wizard completes and shows the success screen
- [ ] `https://yourdomain.com/admin` shows the login page (not a redirect loop or config error)
- [ ] You can log in with your seed admin credentials and are forced to change the password
- [ ] The enrollment you just submitted appears under **Enrollments** in the admin dashboard

---

## Updating the site later

Whenever you make code changes:
1. Upload/pull the new code (File Manager re-upload, `git pull`, or `git deploy` depending on
   which method you used in Step 3).
2. Re-enter the app's virtual environment (Step 6) and run:
   ```bash
   npm install
   npm run build
   npx prisma db push   # only needed if the schema changed
   ```
3. Click **Restart** on the Node.js App page.

Day-to-day content changes (prices, menu, testimonials, contact info) don't need any of this —
they're all editable live from `/admin` as described in the main `README.md`.

---

## Troubleshooting

- **"Environment variable not found: DATABASE_URL"** — you skipped Step 5, or forgot to Restart
  the app after adding env vars. Env vars set in the Node.js App page only take effect after a
  restart.
- **`error=Configuration` on `/admin`** — same as above but specifically for `NEXTAUTH_SECRET`, or
  the app hasn't been restarted since you added it.
- **App shows a blank page or 503** — check the log file path shown on the Node.js App page; it
  will show the actual Node.js error.
- **Changes to `.env`-style variables don't seem to apply** — on cPanel, environment variables
  live in the Node.js App UI, not a `.env` file read by the running process. Local `.env` is only
  used by `npm run dev`/local tooling; on cPanel, always set variables in Step 5's table and
  Restart afterward.
- **MySQL connection errors** — double check the DB user was added to the database with
  privileges (a separate step from creating the user in cPanel's MySQL Databases tool), and that
  you used the full prefixed names (`cpaneluser_dbname`, `cpaneluser_dbuser`).
