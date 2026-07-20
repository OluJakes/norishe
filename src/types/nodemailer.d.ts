// nodemailer is an optional dependency (only used if SMTP_* env vars are
// set). It's dynamically imported in src/lib/email.ts so it doesn't need
// to be installed unless the SMTP path is used. This ambient shim keeps
// the dynamic import type-checkable without requiring the package.
declare module "nodemailer" {
  const nodemailer: {
    createTransport: (opts: any) => {
      sendMail: (opts: any) => Promise<any>;
    };
  };
  export default nodemailer;
}
