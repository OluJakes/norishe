import { prisma } from "@/lib/prisma";
import { Download } from "lucide-react";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { LeadTypeFilter } from "@/components/admin/LeadTypeFilter";

export const dynamic = "force-dynamic";

export default async function LeadsPage({ searchParams }: { searchParams: { type?: string } }) {
  const type = searchParams.type || "";
  let leads: any[] = [];
  let dbError = false;
  try {
    leads = await prisma.lead.findMany({
      where: type ? { type: type as any } : {},
      orderBy: { createdAt: "desc" },
    });
  } catch {
    dbError = true;
  }

  const qs = new URLSearchParams();
  if (type) qs.set("type", type);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl text-forest">Leads</h1>
          <p className="mt-1 text-sm text-charcoal/60">{leads.length} result{leads.length === 1 ? "" : "s"}</p>
        </div>
        <a href={`/api/admin/leads/export?${qs.toString()}`} className="btn-outline-dark">
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      <div className="mt-6">
        <LeadTypeFilter type={type} />
      </div>

      <div className="card-ivory mt-6 overflow-x-auto">
        {dbError ? (
          <p className="p-8 text-center text-sm text-charcoal/50">Database not connected yet.</p>
        ) : leads.length === 0 ? (
          <p className="p-8 text-center text-sm text-charcoal/50">No leads yet.</p>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-charcoal/50">
              <tr>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Name / Company</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/5">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-cream/50">
                  <td className="px-5 py-3"><span className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-forest">{l.type}</span></td>
                  <td className="px-5 py-3 text-charcoal/80">{l.name || l.company || "—"}</td>
                  <td className="px-5 py-3 text-charcoal/70">{l.email}</td>
                  <td className="px-5 py-3 text-charcoal/50">{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3"><LeadStatusSelect id={l.id} status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
