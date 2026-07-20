"use client";
import { useState, useTransition } from "react";
import { updateLeadStatus } from "@/lib/actions/admin";

const STATUSES = ["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"];

export function LeadStatusSelect({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();
  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        setValue(next);
        startTransition(() => updateLeadStatus(id, next));
      }}
      className="input !py-1.5 !text-xs"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s.replace("_", " ")}</option>
      ))}
    </select>
  );
}
