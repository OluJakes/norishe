import { prisma } from "@/lib/prisma";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  let items: any[] = [];
  let dbError = false;
  try {
    items = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    dbError = true;
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-forest">Testimonials</h1>
      <p className="mt-1 text-sm text-charcoal/60">Manage the testimonials shown on the homepage.</p>
      <div className="mt-6">
        {dbError ? (
          <p className="card-ivory p-8 text-center text-sm text-charcoal/50">Database not connected yet.</p>
        ) : (
          <TestimonialsManager items={items} />
        )}
      </div>
    </div>
  );
}
