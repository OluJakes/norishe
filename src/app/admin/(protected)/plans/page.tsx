import { prisma } from "@/lib/prisma";
import { PlanEditor } from "@/components/admin/PlanEditor";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  let plans: any[] = [];
  let dbError = false;
  try {
    plans = await prisma.plan.findMany({ orderBy: { order: "asc" }, include: { tiers: { orderBy: { mealsPerWeek: "asc" } } } });
  } catch {
    dbError = true;
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-forest">Plans & Pricing</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Edit plan copy and manage subscription tier pricing. Changes reflect immediately on the public site.
      </p>

      {dbError ? (
        <p className="card-ivory mt-6 p-8 text-center text-sm text-charcoal/50">
          Database not connected yet. Run <code>npx prisma migrate dev</code> and <code>npm run seed</code> to get started.
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {plans.map((plan) => (
            <PlanEditor key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
