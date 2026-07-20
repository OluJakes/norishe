import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Download } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-amber-100 text-amber-700",
  PLAN_SENT: "bg-purple-100 text-purple-700",
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-gray-200 text-gray-700",
  CHURNED: "bg-red-100 text-red-700",
};

export default async function EnrollmentsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string };
}) {
  const q = searchParams.q || "";
  const status = searchParams.status || "";

  let enrollments: any[] = [];
  let dbError = false;
  try {
    enrollments = await prisma.enrollment.findMany({
      where: {
        AND: [
          status ? { status: status as any } : {},
          q
            ? {
                OR: [
                  { fullName: { contains: q } },
                  { email: { contains: q } },
                  { city: { contains: q } },
                ],
              }
            : {},
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    dbError = true;
  }

  const exportQs = new URLSearchParams();
  if (q) exportQs.set("q", q);
  if (status) exportQs.set("status", status);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl text-forest">Enrollments</h1>
          <p className="mt-1 text-sm text-charcoal/60">{enrollments.length} result{enrollments.length === 1 ? "" : "s"}</p>
        </div>
        <a href={`/api/admin/enrollments/export?${exportQs.toString()}`} className="btn-outline-dark">
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      <form className="mt-6 flex flex-col gap-3 sm:flex-row" method="get">
        <input name="q" defaultValue={q} placeholder="Search name, email, city..." className="input sm:max-w-xs" />
        <select name="status" defaultValue={status} className="input sm:max-w-xs">
          <option value="">All statuses</option>
          {["NEW", "CONTACTED", "PLAN_SENT", "ACTIVE", "PAUSED", "CHURNED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button type="submit" className="btn-outline-dark sm:w-auto">Filter</button>
      </form>

      <div className="card-ivory mt-6 overflow-x-auto">
        {dbError ? (
          <p className="p-8 text-center text-sm text-charcoal/50">
            Database not connected yet. Run <code>npx prisma migrate dev</code> to get started.
          </p>
        ) : enrollments.length === 0 ? (
          <p className="p-8 text-center text-sm text-charcoal/50">No enrollments match your filters.</p>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-charcoal/50">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/5">
              {enrollments.map((e) => (
                <tr key={e.id} className="hover:bg-cream/50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/enrollments/${e.id}`} className="font-medium text-forest hover:underline">{e.fullName}</Link>
                    <p className="text-xs text-charcoal/45">{e.email}</p>
                  </td>
                  <td className="px-5 py-3 text-charcoal/70">{e.interestedPlan || "—"}</td>
                  <td className="px-5 py-3 text-charcoal/70">{e.city}</td>
                  <td className="px-5 py-3 text-charcoal/50">{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[e.status] || ""}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
