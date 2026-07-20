"use client";
import { useState, useTransition } from "react";
import { updateEnrollmentStatus, updateEnrollmentNotes } from "@/lib/actions/admin";

const STATUSES = ["NEW", "CONTACTED", "PLAN_SENT", "ACTIVE", "PAUSED", "CHURNED"];

export function EnrollmentStatusSelect({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        setValue(next);
        startTransition(() => updateEnrollmentStatus(id, next));
      }}
      className="input"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

export function EnrollmentNotes({ id, initialNotes }: { id: string; initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(true);
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        rows={5}
        className="input"
        placeholder="Internal notes about this client..."
      />
      <button
        type="button"
        disabled={pending || saved}
        onClick={() => startTransition(async () => {
          await updateEnrollmentNotes(id, notes);
          setSaved(true);
        })}
        className="btn-outline-dark mt-3"
      >
        {pending ? "Saving..." : saved ? "Saved" : "Save Notes"}
      </button>
    </div>
  );
}
