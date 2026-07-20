"use client";
import { useState, useTransition } from "react";
import { Trash2, Plus } from "lucide-react";
import { createMenuItem, deleteMenuItem } from "@/lib/actions/admin";
import { PLANS } from "@/lib/plans-content";

type MenuItem = { id: string; name: string; imageUrl: string | null; planTags: string; calories: number; protein: number };

export function MenuManager({ items }: { items: MenuItem[] }) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ name: "", imageUrl: "", calories: 0, protein: 0, planTags: [] as string[] });

  function toggleTag(slug: string) {
    setForm((f) => ({
      ...f,
      planTags: f.planTags.includes(slug) ? f.planTags.filter((t) => t !== slug) : [...f.planTags, slug],
    }));
  }

  function submit() {
    if (!form.name) return;
    startTransition(async () => {
      await createMenuItem(form);
      setForm({ name: "", imageUrl: "", calories: 0, protein: 0, planTags: [] });
    });
  }

  return (
    <div>
      <div className="card-ivory p-6">
        <h3 className="font-serif text-lg text-forest">Add Dish</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Dish Name</span>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Image URL (optional)</span>
            <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} className="input" placeholder="/images/your-dish.jpg" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Calories</span>
            <input type="number" value={form.calories} onChange={(e) => setForm((f) => ({ ...f, calories: Number(e.target.value) }))} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Protein (g)</span>
            <input type="number" value={form.protein} onChange={(e) => setForm((f) => ({ ...f, protein: Number(e.target.value) }))} className="input" />
          </label>
        </div>
        <div className="mt-4">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-forest/60">Plan Tags</span>
          <div className="flex flex-wrap gap-2">
            {PLANS.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => toggleTag(p.slug)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  form.planTags.includes(p.slug) ? "border-forest bg-forest text-gold" : "border-forest/15 text-charcoal/60"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <button onClick={submit} disabled={pending} className="btn-gold mt-5">
          <Plus className="h-4 w-4" /> Add to Menu
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const [pending, startTransition] = useTransition();
  let tags: string[] = [];
  try { tags = JSON.parse(item.planTags); } catch {}

  return (
    <div className="card-ivory p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-serif text-forest">{item.name}</p>
        <button
          onClick={() => startTransition(() => deleteMenuItem(item.id))}
          disabled={pending}
          className="flex-shrink-0 text-red-400 hover:text-red-600"
          aria-label="Delete dish"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1 text-xs text-charcoal/50">{item.calories} kcal · {item.protein}g protein</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-cream px-2 py-0.5 text-[10px] uppercase text-charcoal/50">{t}</span>
        ))}
      </div>
    </div>
  );
}
