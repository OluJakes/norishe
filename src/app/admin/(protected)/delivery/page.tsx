import { prisma } from "@/lib/prisma";
import { PrintButton } from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function DeliverySchedulePage() {
  let subs: any[] = [];
  let dbError = false;
  try {
    subs = await prisma.subscription.findMany({
      include: { enrollment: true, plan: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    dbError = true;
  }

  const byDay: Record<string, any[]> = Object.fromEntries(DAYS.map((d) => [d, []]));
  for (const s of subs) {
    let days: string[] = [];
    try { days = JSON.parse(s.deliveryDays); } catch {}
    for (const d of days) {
      if (byDay[d]) byDay[d].push(s);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl text-forest">Delivery Schedule</h1>
          <p className="mt-1 text-sm text-charcoal/60">Upcoming deliveries grouped by weekday.</p>
        </div>
        <PrintButton />
      </div>

      {dbError ? (
        <p className="card-ivory mt-6 p-8 text-center text-sm text-charcoal/50">Database not connected yet.</p>
      ) : subs.length === 0 ? (
        <p className="card-ivory mt-6 p-8 text-center text-sm text-charcoal/50">
          No active subscriptions yet. Subscriptions are created from an enrollment once a client is confirmed and assigned delivery days.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-7">
          {DAYS.map((day) => (
            <div key={day} className="card-ivory p-4">
              <p className="font-serif text-forest">{day}</p>
              <div className="mt-3 space-y-2">
                {byDay[day].length === 0 ? (
                  <p className="text-xs text-charcoal/40">No deliveries</p>
                ) : (
                  byDay[day].map((s) => (
                    <div key={s.id} className="rounded-lg bg-cream px-3 py-2 text-xs">
                      <p className="font-medium text-forest">{s.enrollment?.fullName}</p>
                      <p className="text-charcoal/50">{s.plan?.name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
