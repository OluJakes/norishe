"use client";
import { useState, useTransition } from "react";
import { Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { createTestimonial, toggleTestimonialVisible, deleteTestimonial } from "@/lib/actions/admin";

type Testimonial = { id: string; name: string; role: string | null; quote: string; rating: number; visible: boolean };

export function TestimonialsManager({ items }: { items: Testimonial[] }) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ name: "", role: "", quote: "", rating: 5 });

  function submit() {
    if (!form.name || !form.quote) return;
    startTransition(async () => {
      await createTestimonial(form);
      setForm({ name: "", role: "", quote: "", rating: 5 });
    });
  }

  return (
    <div>
      <div className="card-ivory p-6">
        <h3 className="font-serif text-lg text-forest">Add Testimonial</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Name</span>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Role / Context (optional)</span>
            <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="input" />
          </label>
        </div>
        <label className="mt-4 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Quote</span>
          <textarea value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} rows={3} className="input" />
        </label>
        <label className="mt-4 block w-32">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Rating</span>
          <select value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))} className="input">
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
          </select>
        </label>
        <button onClick={submit} disabled={pending} className="btn-gold mt-5">
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="card-ivory p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-forest">{t.name}</p>
          {t.role && <p className="text-xs text-charcoal/45">{t.role}</p>}
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={() => startTransition(() => toggleTestimonialVisible(t.id, !t.visible))}
            disabled={pending}
            className="text-charcoal/50 hover:text-forest"
            aria-label={t.visible ? "Hide" : "Show"}
          >
            {t.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button
            onClick={() => startTransition(() => deleteTestimonial(t.id))}
            disabled={pending}
            className="text-red-400 hover:text-red-600"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm italic text-charcoal/70">"{t.quote}"</p>
      <p className="mt-2 text-xs text-charcoal/40">{t.visible ? "Visible on site" : "Hidden"}</p>
    </div>
  );
}
