"use client";
import { useState, useTransition } from "react";
import { updateSettings } from "@/lib/actions/admin";

type Settings = {
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  address: string;
  deliveryNote: string;
  announcementBanner: string | null;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const [form, setForm] = useState({
    phone: settings.phone,
    email: settings.email,
    whatsapp: settings.whatsapp,
    instagram: settings.instagram,
    address: settings.address,
    deliveryNote: settings.deliveryNote,
    announcementBanner: settings.announcementBanner || "",
  });
  const [saved, setSaved] = useState(true);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  return (
    <div className="card-ivory max-w-2xl p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Phone</span>
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Email</span>
          <input value={form.email} onChange={(e) => update("email", e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">WhatsApp Number (intl, no +)</span>
          <input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className="input" placeholder="2347061808293" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Instagram Handle</span>
          <input value={form.instagram} onChange={(e) => update("instagram", e.target.value)} className="input" placeholder="norishe.vip" />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Business Address</span>
        <input value={form.address} onChange={(e) => update("address", e.target.value)} className="input" placeholder="Street, area, city, state, country" />
      </label>
      <label className="mt-4 block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Delivery Area Note</span>
        <textarea value={form.deliveryNote} onChange={(e) => update("deliveryNote", e.target.value)} rows={2} className="input" placeholder="Shown on the Contact and FAQ pages" />
      </label>
      <label className="mt-4 block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Announcement Banner (optional)</span>
        <input value={form.announcementBanner} onChange={(e) => update("announcementBanner", e.target.value)} className="input" placeholder="e.g. Now delivering to Abuja!" />
      </label>
      <button
        onClick={() => startTransition(async () => { await updateSettings(form); setSaved(true); })}
        disabled={pending || saved}
        className="btn-gold mt-5"
      >
        {pending ? "Saving..." : saved ? "Saved" : "Save Settings"}
      </button>
    </div>
  );
}
