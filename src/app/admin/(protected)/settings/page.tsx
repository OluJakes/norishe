import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { STATIC_SETTINGS } from "@/lib/static-content";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings: any = STATIC_SETTINGS;
  try {
    settings = (await prisma.settings.findUnique({ where: { id: "singleton" } })) || STATIC_SETTINGS;
  } catch {
    /* fall back to static defaults */
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-forest">Settings</h1>
      <p className="mt-1 text-sm text-charcoal/60">Contact info, WhatsApp, and site-wide announcements.</p>
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>

      <div className="mt-10 max-w-md">
        <h2 className="font-serif text-xl text-forest">Change Your Password</h2>
        <div className="card-ivory mt-4 p-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
