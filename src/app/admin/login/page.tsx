import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Admin Sign In | Norishé", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-gradient px-4 pt-20">
      <LoginForm />
    </div>
  );
}
