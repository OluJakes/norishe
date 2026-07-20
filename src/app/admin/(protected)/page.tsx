import { prisma } from "@/lib/prisma";
import { ClipboardList, Users, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function safeCount(fn: () => Promise<number>) {
  try {
    return await fn();
  } catch {
    return 0;
  }
}

async function getKpis() {
  const now = new Date();
  const d7 = new Date(now.getTime() - 7 * 86400000);
  const d30 = new Date(now.getTime() - 30 * 86400000);

  const [enroll7, enroll30, leadsTotal, activeSubs, recent, planCounts] = await Promise.all([
    safeCount(() => prisma.enrollment.count({ where: { createdAt: { gte: d7 } } })),
    safeCount(() => prisma.enrollment.count({ where: { createdAt: { gte: d30 } } })),
    safeCount(() => prisma.lead.count()),
    safeCount(() => prisma.subscription.count({ where: { paymentStatus: "PAID" } })),
    prisma.enrollment.findMany({ orderBy: { createdAt: "desc" }, take: 6 }).catch(() => []),
    prisma.enrollment
      .groupBy({ by: ["interestedPlan"], _count: { interestedPlan: true } })
      .catch(() => [] as any[]),
  ]);

  const topPlan = (planCounts as any[])
    .filter((p) => p.interestedPlan)
    .sort((a, b) => b._count.interestedPlan - a._count.interestedPlan)[0]?.interestedPlan;

  return { enroll7, enroll30, leadsTotal, activeSubs, recent, topPlan };
}

export default async function AdminDashboard() {
  const { enroll7, enroll30, leadsTotal, activeSubs, recent, topPlan } = await getKpis();

  const cards = [
    { label: "New Enrollments (7 days)", value: enroll7, icon: ClipboardList },
    { label: "New Enrollments (30 days)", value: enroll30, icon: ClipboardList },
    { label: "Total Leads", value: leadsTotal, icon: Users },
    { label: "Active Subscribers", value: activeSubs, icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-forest">Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal/60">An overview of Norishé's enrollments, leads, and activity.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card-ivory p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-gold">
              <c.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-forest">{c.value}</p>
            <p className="mt-1 text-xs text-charcoal/55">{c.label}</p>
          </div>
        ))}
        <div className="card-ivory p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-gold">
            <Award className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xl font-semibold text-forest">{topPlan || "—"}</p>
          <p className="mt-1 text-xs text-charcoal/55">Most-Requested Plan</p>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-forest">Recent Activity</h2>
          <Link href="/admin/enrollments" className="text-sm font-semibold text-gold-dark hover:underline">View all</Link>
        </div>
        <div className="card-ivory overflow-hidden">
          {recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-charcoal/50">
              No enrollments yet. Once your database is migrated and seeded, submissions will appear here.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-cream text-left text-xs uppercase tracking-wide text-charcoal/50">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Plan</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/5">
                {recent.map((e: any) => (
                  <tr key={e.id} className="hover:bg-cream/50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/enrollments/${e.id}`} className="font-medium text-forest hover:underline">{e.fullName}</Link>
                    </td>
                    <td className="px-5 py-3 text-charcoal/70">{e.interestedPlan || "—"}</td>
                    <td className="px-5 py-3 text-charcoal/70">{e.city}</td>
                    <td className="px-5 py-3 text-charcoal/70">{e.status}</td>
                    <td className="px-5 py-3 text-charcoal/50">{new Date(e.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
