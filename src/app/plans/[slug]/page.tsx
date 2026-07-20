import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { CtaLink } from "@/components/ui/CtaLink";
import { formatNaira } from "@/lib/utils";
import { getPlanBySlug, getPlans } from "@/lib/data";

export async function generateStaticParams() {
  const plans = await getPlans();
  return plans.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const plan = await getPlanBySlug(params.slug);
  if (!plan) return { title: "Plan Not Found" };
  return {
    title: plan.name,
    description: plan.description,
    alternates: { canonical: `/plans/${plan.slug}` },
    openGraph: { title: `${plan.name} | Norishé`, description: plan.description },
  };
}

const FAQ_BY_PLAN: Record<string, { q: string; a: string }[]> = {
  default: [
    { q: "Can I change my plan later?", a: "Yes — you can switch plans at any time from your next billing cycle. Just let our team know." },
    { q: "How is this priced?", a: "Choose a weekly meal count and billing cadence at checkout; final pricing is confirmed by our team based on your enrollment." },
    { q: "What if I have allergies?", a: "Tell us during enrollment — we tailor every plan around allergies and dietary restrictions." },
  ],
};

export default async function PlanDetailPage({ params }: { params: { slug: string } }) {
  const plan = await getPlanBySlug(params.slug);
  if (!plan) notFound();

  const faqs = FAQ_BY_PLAN[plan.slug] || FAQ_BY_PLAN.default;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: plan.name,
    description: plan.description,
    brand: { "@type": "Brand", name: "Norishé" },
    offers: plan.tiers.map((t) => ({
      "@type": "Offer",
      price: t.priceNaira,
      priceCurrency: "NGN",
      description: `${t.mealsPerWeek} meals per week, billed ${t.billing}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-forest-gradient pt-40 pb-24 text-center">
        <Container>
          <span className="text-4xl">{plan.emoji}</span>
          <h1 className="mt-4 font-serif text-4xl text-ivory sm:text-5xl">{plan.name}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg italic text-gold-light">{plan.tagline}</p>
        </Container>
      </section>

      <section className="bg-ivory py-20">
        <Container className="grid gap-14 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal>
              <SectionLabel>Overview</SectionLabel>
              <p className="text-charcoal/75 leading-relaxed">{plan.description}</p>
              <p className="mt-4 text-charcoal/70 leading-relaxed italic">{plan.philosophy}</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-12">
              <SectionLabel>Perfect For</SectionLabel>
              <ul className="grid gap-3 sm:grid-cols-2">
                {plan.perfectFor.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-charcoal/75">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" /> {p}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15} className="mt-12">
              <SectionLabel>Sample Weekly Menu</SectionLabel>
              <ul className="space-y-3">
                {plan.sampleMenu.map((m) => (
                  <li key={m} className="rounded-xl bg-cream px-5 py-3.5 text-sm text-charcoal/80">{m}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="mt-12">
              <SectionLabel>Mini FAQ</SectionLabel>
              <div className="space-y-4">
                {faqs.map((f) => (
                  <div key={f.q} className="rounded-xl bg-cream p-5">
                    <p className="font-medium text-forest">{f.q}</p>
                    <p className="mt-1.5 text-sm text-charcoal/65">{f.a}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.1}>
              <div className="card-ivory sticky top-28 p-7">
                <SectionLabel>Subscription Tiers</SectionLabel>
                <div className="space-y-3">
                  {plan.tiers.map((t) => (
                    <div key={`${t.mealsPerWeek}-${t.billing}`} className="rounded-xl border border-forest/10 p-4">
                      <p className="font-serif text-lg text-forest">{t.mealsPerWeek} meals / week</p>
                      <p className="text-xs uppercase tracking-wide text-charcoal/50">Billed {t.billing}</p>
                      <p className="mt-2 text-xl font-semibold text-gold-dark">{formatNaira(t.priceNaira)}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] text-charcoal/40">
                  Prices shown are starting estimates — final pricing confirmed at enrollment. // TODO: owner sets real prices in admin.
                </p>
                <CtaLink href={`/enroll?plan=${plan.slug}`} label={`plan-detail-enroll-${plan.slug}`} className="mt-5 w-full">
                  Enroll in {plan.name}
                </CtaLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
