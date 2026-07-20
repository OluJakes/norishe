"use client";
import { cx } from "@/lib/utils";

export function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-forest/70">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-charcoal/40">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

export function ChipGroup({
  options,
  value,
  onChange,
  multi = true,
}: {
  options: string[];
  value: string[] | string;
  onChange: (v: any) => void;
  multi?: boolean;
}) {
  const selected = Array.isArray(value) ? value : [value].filter(Boolean);
  function toggle(opt: string) {
    if (multi) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(opt) ? arr.filter((v) => v !== opt) : [...arr, opt]);
    } else {
      onChange(opt);
    }
  }
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            type="button"
            key={opt}
            onClick={() => toggle(opt)}
            className={cx(
              "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
              active
                ? "border-forest bg-forest text-gold"
                : "border-forest/15 bg-white text-charcoal/70 hover:border-forest/40"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 5,
  labels,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  labels?: [string, string];
}) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#C9A24B]"
      />
      <div className="mt-2 flex items-center justify-between text-xs text-charcoal/50">
        <span>{labels?.[0] ?? min}</span>
        <span className="font-serif text-lg text-forest">{value}</span>
        <span>{labels?.[1] ?? max}</span>
      </div>
    </div>
  );
}

export function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-forest sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-charcoal/60">{subtitle}</p>}
      <div className="mt-8 space-y-6">{children}</div>
    </div>
  );
}
