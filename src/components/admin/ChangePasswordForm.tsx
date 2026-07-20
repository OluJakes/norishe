"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong.");
      return;
    }
    await signOut({ callbackUrl: "/admin/login" });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-forest/70">New Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="input" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-forest/70">Confirm Password</span>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} className="input" />
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="btn-gold w-full">
        {loading ? "Saving..." : "Save & Sign In Again"}
      </button>
    </form>
  );
}
