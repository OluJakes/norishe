"use client";
import { useState, useTransition } from "react";
import { Trash2, Plus } from "lucide-react";
import { updatePlanDetails, addPlanTier, updatePlanTier, deletePlanTier } from "@/lib/actions/admin";
import { formatNaira } from "@/lib/utils";

type Tier = { id: string; mealsPerWeek: number; billing: string; priceNaira: number; active: boolean };
type Plan = {
  id: string;
  slug: string;
  emoji: string;
  name: string;
  tagline: string;
  description: string;
  active: boolean;
  popular: boolean;
  tiers: Tier[];
};

export function PlanEditor({ plan }: { plan: Plan }) {
  const [name, setName] = useState(plan.name);
  const [tagline, setTagline] = useState(plan.tagline);
  const [description, setDescription] = useState(plan.description);
  const [active, setActive] = useState(plan.active);
  const [popular, setPopular] = useState(plan.popular);
  const [saved, setSaved] = useState(true);
  const [pending, startTransition] = useTransition();

  const [newTier, setNewTier] = useState({ mealsPerWeek: 5, billing: "weekly", priceNaira: 0 });

  function markDirty() {
    setSaved(false);
  }

  function save() {
    startTransition(async () => {
      await updatePlanDetails(plan.id, { name, tagline, description, active, popular });
      setSaved(true);
    });
  }

  return (
    <div className="card-ivory p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-forest">{plan.emoji} {plan.name}</h3>
        <span className="text-xs text-charcoal/40">/plans/{plan.slug}</span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Name</span>
          <input value={name} onChange={(e) => { setName(e.target.value); markDirty(); }} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Tagline</span>
          <input value={tagline} onChange={(e) => { setTagline(e.target.value); markDirty(); }} className="input" />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Description</span>
        <textarea value={description} onChange={(e) => { setDescription(e.target.value); markDirty(); }} rows={3} className="input" />
      </label>

      <div className="mt-4 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-charcoal/70">
          <input type="checkbox" checked={active} onChange={(e) => { setActive(e.target.checked); markDirty(); }} className="h-4 w-4 accent-[#1E3A2A]" />
          Active (visible on site)
        </label>
        <label className="flex items-center gap-2 text-sm text-charcoal/70">
          <input type="checkbox" checked={popular} onChange={(e) => { setPopular(e.target.checked); markDirty(); }} className="h-4 w-4 accent-[#1E3A2A]" />
          "Most Popular" ribbon
        </label>
      </div>

      <button onClick={save} disabled={pending || saved} className="btn-outline-dark mt-4">
        {pending ? "Saving..." : saved ? "Saved" : "Save Changes"}
      </button>

      <div className="mt-6 border-t border-forest/10 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-forest/60">Subscription Tiers</p>
        <div className="mt-3 space-y-2">
          {plan.tiers.map((t) => (
            <TierRow key={t.id} tier={t} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-charcoal/50">Meals/week</span>
            <input
              type="number"
              value={newTier.mealsPerWeek}
              onChange={(e) => setNewTier((t) => ({ ...t, mealsPerWeek: Number(e.target.value) }))}
              className="input w-24"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-charcoal/50">Billing</span>
            <select
              value={newTier.billing}
              onChange={(e) => setNewTier((t) => ({ ...t, billing: e.target.value }))}
              className="input w-32"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-charcoal/50">Price (₦)</span>
            <input
              type="number"
              value={newTier.priceNaira}
              onChange={(e) => setNewTier((t) => ({ ...t, priceNaira: Number(e.target.value) }))}
              className="input w-32"
            />
          </label>
          <button
            type="button"
            onClick={() => startTransition(() => addPlanTier(plan.id, newTier))}
            className="btn-gold !py-2.5"
          >
            <Plus className="h-4 w-4" /> Add Tier
          </button>
        </div>
      </div>
    </div>
  );
}

function TierRow({ tier }: { tier: Tier }) {
  const [price, setPrice] = useState(tier.priceNaira);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg bg-cream px-4 py-2.5">
      <span className="text-sm text-charcoal/70 w-32">{tier.mealsPerWeek} meals/wk</span>
      <span className="text-xs uppercase text-charcoal/40 w-20">{tier.billing}</span>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        onBlur={() => startTransition(() => updatePlanTier(tier.id, { priceNaira: price }))}
        className="input w-32 !py-1.5"
      />
      <span className="text-xs text-charcoal/40">{formatNaira(price)}</span>
      <button
        type="button"
        onClick={() => startTransition(() => deletePlanTier(tier.id))}
        disabled={pending}
        className="ml-auto text-red-400 hover:text-red-600"
        aria-label="Delete tier"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
