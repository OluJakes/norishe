"use client";
import { useMemo, useState, useTransition } from "react";
import { updateSiteContent } from "@/lib/actions/admin";
import { SITE_CONTENT_FIELDS } from "@/lib/site-content";
import { RefreshCw, Save } from "lucide-react";

export function SiteContentEditor({ content }: { content: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(content);
  const [saved, setSaved] = useState(true);
  const [pending, startTransition] = useTransition();

  const groups = useMemo(() => {
    const map = new Map<string, typeof SITE_CONTENT_FIELDS>();
    for (const field of SITE_CONTENT_FIELDS) {
      if (!map.has(field.group)) map.set(field.group, []);
      map.get(field.group)!.push(field);
    }
    return Array.from(map.entries());
  }, []);

  function update(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  function resetField(key: string, defaultValue: string) {
    update(key, defaultValue);
  }

  function saveAll() {
    startTransition(async () => {
      await updateSiteContent(Object.entries(values).map(([key, value]) => ({ key, value })));
      setSaved(true);
    });
  }

  return (
    <div>
      <div className="sticky top-16 z-10 -mx-5 mb-6 flex items-center justify-between border-b border-forest/10 bg-cream/95 px-5 py-3 backdrop-blur lg:-mx-8 lg:px-8">
        <p className="text-sm text-charcoal/60">
          {saved ? "All changes saved." : "You have unsaved changes."}
        </p>
        <button onClick={saveAll} disabled={pending || saved} className="btn-gold !py-2.5">
          <Save className="h-4 w-4" /> {pending ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <div className="space-y-8">
        {groups.map(([group, fields]) => (
          <div key={group} className="card-ivory p-6">
            <h2 className="font-serif text-lg text-forest">{group}</h2>
            <div className="mt-4 space-y-4">
              {fields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-forest/60">
                    {field.label}
                    <button
                      type="button"
                      onClick={() => resetField(field.key, field.defaultValue)}
                      className="flex items-center gap-1 text-[10px] font-normal normal-case text-charcoal/35 hover:text-gold-dark"
                      title="Reset to original wording"
                    >
                      <RefreshCw className="h-3 w-3" /> Reset
                    </button>
                  </span>
                  {field.type === "textarea" ? (
                    <textarea
                      value={values[field.key] ?? ""}
                      onChange={(e) => update(field.key, e.target.value)}
                      rows={2}
                      className="input"
                    />
                  ) : (
                    <input
                      value={values[field.key] ?? ""}
                      onChange={(e) => update(field.key, e.target.value)}
                      className="input"
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
