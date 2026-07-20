"use client";
import { useRouter } from "next/navigation";

export function LeadTypeFilter({ type }: { type: string }) {
  const router = useRouter();
  return (
    <select
      name="type"
      defaultValue={type}
      onChange={(e) => router.push(`/admin/leads${e.target.value ? `?type=${e.target.value}` : ""}`)}
      className="input max-w-xs"
    >
      <option value="">All types</option>
      <option value="NEWSLETTER">Newsletter</option>
      <option value="CONTACT">Contact</option>
      <option value="CORPORATE">Corporate</option>
      <option value="EXIT_INTENT">Exit Intent</option>
    </select>
  );
}
