import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  let topPages: { path: string; count: number }[] = [];
  let topCtas: { label: string; count: number }[] = [];
  let totalPageviews = 0;
  let totalClicks = 0;
  let dbError = false;

  try {
    const [pageviews, clicks] = await Promise.all([
      prisma.analyticsEvent.findMany({ where: { type: "pageview" } }),
      prisma.analyticsEvent.findMany({ where: { type: "cta_click" } }),
    ]);
    totalPageviews = pageviews.length;
    totalClicks = clicks.length;

    const pageCounts: Record<string, number> = {};
    for (const p of pageviews) pageCounts[p.path] = (pageCounts[p.path] || 0) + 1;
    topPages = Object.entries(pageCounts).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 10);

    const ctaCounts: Record<string, number> = {};
    for (const c of clicks) {
      const label = c.label || "unknown";
      ctaCounts[label] = (ctaCounts[label] || 0) + 1;
    }
    topCtas = Object.entries(ctaCounts).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  } catch {
    dbError = true;
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-forest">Analytics</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        First-party page views and CTA clicks logged directly by this site — no third-party trackers required.
      </p>

      {dbError ? (
        <p className="card-ivory mt-6 p-8 text-center text-sm text-charcoal/50">Database not connected yet.</p>
      ) : (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="card-ivory p-6">
              <p className="text-3xl font-semibold text-forest">{totalPageviews}</p>
              <p className="mt-1 text-xs text-charcoal/55">Total Page Views</p>
            </div>
            <div className="card-ivory p-6">
              <p className="text-3xl font-semibold text-forest">{totalClicks}</p>
              <p className="mt-1 text-xs text-charcoal/55">Total CTA Clicks</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="card-ivory p-6">
              <h2 className="font-serif text-lg text-forest">Top Pages</h2>
              <div className="mt-4 space-y-2">
                {topPages.length === 0 && <p className="text-sm text-charcoal/45">No data yet.</p>}
                {topPages.map((p) => (
                  <div key={p.path} className="flex items-center justify-between text-sm">
                    <span className="text-charcoal/70">{p.path}</span>
                    <span className="font-semibold text-forest">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-ivory p-6">
              <h2 className="font-serif text-lg text-forest">Top CTA Clicks</h2>
              <div className="mt-4 space-y-2">
                {topCtas.length === 0 && <p className="text-sm text-charcoal/45">No data yet.</p>}
                {topCtas.map((c) => (
                  <div key={c.label} className="flex items-center justify-between text-sm">
                    <span className="text-charcoal/70">{c.label}</span>
                    <span className="font-semibold text-forest">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mt-8 card-ivory p-6">
        <h2 className="font-serif text-lg text-forest">Third-Party Analytics (Optional)</h2>
        <p className="mt-2 text-sm text-charcoal/60">
          To add Google Analytics 4 or Meta Pixel, set <code>NEXT_PUBLIC_GA4_ID</code> or{" "}
          <code>NEXT_PUBLIC_META_PIXEL_ID</code> in your environment variables and wire them into{" "}
          <code>src/app/layout.tsx</code>. Left disabled by default to keep the site tracker-free out of the box.
        </p>
      </div>
    </div>
  );
}
