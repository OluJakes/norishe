import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { CtaLink } from "@/components/ui/CtaLink";
import { formatNaira } from "@/lib/utils";
import { getPlans } from "@/lib/data";

export const metadata: Metadata = {
  title: "Meal Plans",
  description:
    "Explore all six Norishé meal plans — Fat Loss, Wellness & Maintenance, Muscle Gain, Executive, Family, and Custom. Freshly prepared, balanced meals delivered across Nigeria.",
  alternates: { canonical: "/plans" },
};

const WHY_CHOOSE = [
  "Freshly prepared quality ingredients",
  "Balanced nutrition crafted with care",
  "Flexible plans for every lifestyle",
  "Convenient ordering and reliable delivery",
  "Premium presentation with exceptional taste",
  "Personalized support",
];

export default async function PlansPage() {
  const plans = await getPlans();
  return (
    <>
      <section className="bg-forest-gradient pt-40 pb-24 text-center">
        <Container>
          <SectionLabel light center>Meal Plans</SectionLabel>
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">Choose Your Path to Wellness</h1>
          <p className="mx-auto mt-5 max-w-xl text-cream/75">
            Six thoughtfully designed plans — each built around a different goal, all prepared with the same Norishé standard of care.
          </p>
        </Container>
      </section>

      <section className="bg-cream py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <Reveal key={plan.slug} delay={i * 0.05}>
                <div className="relative flex h-full flex-col rounded-xl2 bg-ivory p-8 shadow-soft">
                  {plan.popular && (
                    <span className="absolute -top-3 right-6 rounded-full bg-gold-gradient px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-forest-dark shadow-gold">
                      Most Popular
                    </span>
                  )}
                  <span className="text-3xl">{plan.emoji}</span>
                  <h2 className="mt-4 font-serif text-2xl text-forest">{plan.name}</h2>
                  <p className="mt-2 italic text-sm text-gold-dark">{plan.tagline}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal/65">{plan.description}</p>
                  <ul className="mt-5 space-y-2">
                    {plan.perfectFor.slice(0, 3).map((p) => (
                      <li key={p} className="leaf-bullet flex items-center text-sm text-charcoal/70">{p}</li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm font-semibold text-gold-dark">
                    {plan.tiers[0] ? `From ${formatNaira(plan.tiers[0].priceNaira)}/week` : "Pricing on request"}
                  </p>
                  <Link
                    href={`/plans/${plan.slug}`}
                    className="btn-outline-dark mt-5 group"
                  >
                    View Plan <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ivory py-24">
        <Container className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionLabel>Why Choose Norishé</SectionLabel>
            <h2 className="font-serif text-3xl text-forest sm:text-4xl">Every Plan, Held to the Same Standard</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {WHY_CHOOSE.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal/75">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" /> {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section className="bg-forest-gradient py-20 text-center">
        <Container>
          <h2 className="font-serif text-3xl text-ivory sm:text-4xl">Start Your Wellness Journey Today</h2>
          <p className="mx-auto mt-3 max-w-lg text-cream/70">Healthy living begins with one choice.</p>
          <div className="mt-7"><CtaLink href="/enroll" label="plans-index-cta">Enroll Now</CtaLink></div>
        </Container>
      </section>
    </>
  );
}
