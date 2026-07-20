/**
 * Provider-agnostic email service layer.
 * Uses Resend if RESEND_API_KEY is set, otherwise falls back to Nodemailer
 * (if SMTP_* vars are set), otherwise logs to console (safe no-op stub).
 */

type SendArgs = { to: string; subject: string; html: string };

async function sendViaResend({ to, subject, html }: SendArgs) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Norishé <hello@norishe.vip>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) {
    console.error("[email] Resend send failed", await res.text());
  }
}

async function sendViaNodemailer({ to, subject, html }: SendArgs) {
  try {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transport.sendMail({
      from: process.env.EMAIL_FROM || "Norishé <hello@norishe.vip>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("[email] Nodemailer send failed", err);
  }
}

export async function sendEmail(args: SendArgs) {
  if (process.env.RESEND_API_KEY) return sendViaResend(args);
  if (process.env.SMTP_HOST) return sendViaNodemailer(args);
  console.log(`[email:stub] To: ${args.to} | Subject: ${args.subject}`);
  return Promise.resolve();
}

export function adminNotificationEmail(subject: string, rows: Record<string, unknown>) {
  const html = `
    <div style="font-family:sans-serif;background:#F5F1E8;padding:24px">
      <div style="background:#FAF8F3;border-radius:12px;padding:24px;max-width:560px;margin:0 auto">
        <h2 style="color:#1E3A2A;font-family:Georgia,serif">${subject}</h2>
        <table style="width:100%;border-collapse:collapse">
          ${Object.entries(rows)
            .map(
              ([k, v]) =>
                `<tr><td style="padding:6px 0;color:#666;vertical-align:top;width:40%">${k}</td><td style="padding:6px 0;color:#232323">${String(
                  v ?? "—"
                )}</td></tr>`
            )
            .join("")}
        </table>
      </div>
    </div>`;
  return html;
}

export function welcomeEmail(name: string) {
  return `
    <div style="font-family:sans-serif;background:#1E3A2A;padding:32px">
      <div style="background:#FAF8F3;border-radius:16px;padding:32px;max-width:560px;margin:0 auto;text-align:center">
        <h1 style="color:#1E3A2A;font-family:Georgia,serif;letter-spacing:0.02em">Norishé</h1>
        <p style="color:#C9A24B;letter-spacing:0.2em;font-size:12px;text-transform:uppercase">Nourish. Power. Thrive.</p>
        <h2 style="color:#232323;font-family:Georgia,serif">Welcome to the Norishé Family, ${name}!</h2>
        <p style="color:#555;line-height:1.6">
          Our team will review your information and contact you within 24–48 hours
          with your personalized recommendation and next steps.
        </p>
        <p style="color:#555;font-style:italic;margin-top:24px">
          "Prepared with care, balance, and intention — just for you."
        </p>
      </div>
    </div>`;
}
