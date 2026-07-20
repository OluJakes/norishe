"use client";
import { useState } from "react";
import Image from "next/image";
import { Flame, Beef } from "lucide-react";
import { cx } from "@/lib/utils";

type MenuItem = { id: string; name: string; imageUrl: string | null; planTags: string[]; calories: number; protein: number };

const FILTERS = [
  { slug: "all", label: "All" },
  { slug: "fat-loss", label: "Fat Loss" },
  { slug: "wellness-maintenance", label: "Wellness" },
  { slug: "muscle-gain", label: "Muscle Gain" },
  { slug: "executive", label: "Executive" },
  { slug: "family", label: "Family" },
  { slug: "custom", label: "Custom" },
];

export function MenuGallery({ items }: { items: MenuItem[] }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? items : items.filter((i) => i.planTags.includes(filter));

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5">
        {FILTERS.map((f) => (
          <button
            key={f.slug}
            onClick={() => setFilter(f.slug)}
            className={cx(
              "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
              filter === f.slug
                ? "border-forest bg-forest text-gold"
                : "border-forest/15 text-forest/70 hover:border-forest/40"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
        {filtered.map((item) => (
          <div key={item.id} className="mb-6 break-inside-avoid overflow-hidden rounded-xl2 bg-ivory shadow-soft">
            <div className="relative aspect-[4/3] w-full">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-cream text-charcoal/30">No image</div>
              )}
            </div>
            <div className="p-5">
              <p className="font-serif text-lg text-forest">{item.name}</p>
              <div className="mt-2 flex gap-4 text-xs text-charcoal/60">
                <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-gold" /> {item.calories} kcal</span>
                <span className="flex items-center gap-1"><Beef className="h-3.5 w-3.5 text-gold" /> {item.protein}g protein</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-charcoal/50">No dishes tagged for this plan yet — check back soon.</p>
      )}
    </div>
  );
}
