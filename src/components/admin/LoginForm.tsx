"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl2 bg-ivory p-8 shadow-soft">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest text-gold">
        <Lock className="h-5 w-5" />
      </div>
      <h1 className="mt-4 text-center font-serif text-2xl text-forest">Admin Sign In</h1>
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-forest/70">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-forest/70">Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="input" />
        </label>
      </div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="btn-gold mt-6 w-full">
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
