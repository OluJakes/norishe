/**
 * Custom entry point for cPanel's "Setup Node.js App" (Phusion Passenger).
 *
 * Passenger doesn't run `npm start` / `next start` directly — it expects a
 * single Node.js file that starts an HTTP server listening on the port
 * Passenger assigns via process.env.PORT. This file wraps Next.js's
 * production server so Passenger can manage it like any other Node app.
 *
 * Not used in normal local development (`npm run dev` / `npm start` still
 * work as usual) — this file is only the production entry point on cPanel.
 * See CPANEL_DEPLOYMENT.md for the full setup walkthrough.
 */
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`Norishé is running on port ${port} (${dev ? "development" : "production"})`);
    });
  })
  .catch((err) => {
    console.error("Failed to start Next.js server:", err);
    process.exit(1);
  });
