import { prisma } from "@/lib/prisma";
import { FaqManager } from "@/components/admin/FaqManager";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  let items: any[] = [];
  let dbError = false;
  try {
    items = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });
  } catch {
    dbError = true;
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-forest">FAQ</h1>
      <p className="mt-1 text-sm text-charcoal/60">Manage the questions and answers shown on the public /faq page.</p>
      <div className="mt-6">
        {dbError ? (
          <p className="card-ivory p-8 text-center text-sm text-charcoal/50">Database not connected yet.</p>
        ) : (
          <FaqManager items={items} />
        )}
      </div>
    </div>
  );
}
