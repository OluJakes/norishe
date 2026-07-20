import { prisma } from "@/lib/prisma";
import { MenuManager } from "@/components/admin/MenuManager";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  let items: any[] = [];
  let dbError = false;
  try {
    items = await prisma.menuItem.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    dbError = true;
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-forest">Menu Manager</h1>
      <p className="mt-1 text-sm text-charcoal/60">Manage dishes shown on the public /menu gallery.</p>
      <div className="mt-6">
        {dbError ? (
          <p className="card-ivory p-8 text-center text-sm text-charcoal/50">Database not connected yet.</p>
        ) : (
          <MenuManager items={items} />
        )}
      </div>
    </div>
  );
}
