import { getContent } from "@/lib/data";
import { SiteContentEditor } from "@/components/admin/SiteContentEditor";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const content = await getContent();

  return (
    <div>
      <h1 className="font-serif text-3xl text-forest">Site Content</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Edit the marketing copy across the homepage, About page, How It Works, and Corporate page —
        no code changes needed. Business address, phone, WhatsApp, and Instagram live under{" "}
        <a href="/admin/settings" className="text-gold-dark hover:underline">Settings</a>, and FAQ
        questions live under <a href="/admin/faq" className="text-gold-dark hover:underline">FAQ</a>.
      </p>
      <div className="mt-6">
        <SiteContentEditor content={content} />
      </div>
    </div>
  );
}
