"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "@/lib/utils";

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.q} className="overflow-hidden rounded-xl bg-ivory shadow-soft">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            aria-expanded={open === i}
          >
            <span className="font-serif text-lg text-forest">{item.q}</span>
            <ChevronDown className={cx("h-5 w-5 flex-shrink-0 text-gold transition-transform", open === i && "rotate-180")} />
          </button>
          <div className={cx("grid transition-all duration-300", open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="overflow-hidden">
              <p className="px-6 pb-5 text-sm leading-relaxed text-charcoal/70">{item.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
