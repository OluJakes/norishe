import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { MobileAdminNav } from "@/components/admin/MobileAdminNav";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const metadata = { title: "Admin | Norishé", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const mustChangePwd = (session.user as any)?.mustChangePwd;

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-forest/10 bg-ivory px-5 py-4 lg:px-8">
          <div className="lg:hidden">
            <MobileAdminNav />
          </div>
          <div className="ml-auto text-sm text-charcoal/60">
            Signed in as <span className="font-medium text-forest">{session.user?.email}</span>
          </div>
        </header>
        <main className="p-5 lg:p-8">
          {mustChangePwd ? <ForcedPasswordChangeNotice /> : children}
        </main>
      </div>
    </div>
  );
}

function ForcedPasswordChangeNotice() {
  return (
    <div className="mx-auto max-w-md">
      <div className="card-ivory p-8">
        <h1 className="font-serif text-2xl text-forest">Set a New Password</h1>
        <p className="mt-2 text-sm text-charcoal/60">
          For security, please set a new password before continuing to the admin panel.
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
