import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { formatNaira } from "@/lib/utils";
import type { PlanWithTiers } from "@/lib/data";

export function PlansPreview({ plans }: { plans: PlanWithTiers[] }) {
  return (
    <section className="bg-forest-gradient py-24">
      <Container>
        <Reveal>
          <SectionLabel light center>Meal Plans</SectionLabel>
          <h2 className="text-center font-serif text-3xl text-ivory sm:text-4xl">Choose Your Path to Wellness</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const fromPrice = plan.tiers[0]?.priceNaira;
            return (
              <Reveal key={plan.slug} delay={i * 0.05}>
                <Link
                  href={`/plans/${plan.slug}`}
                  className="group relative flex h-full flex-col rounded-xl2 bg-ivory p-7 shadow-soft transition-transform hover:-translate-y-1"
                >
                  {plan.popular && (
                    <span className="absolute -top-3 right-6 rounded-full bg-gold-gradient px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-forest-dark shadow-gold">
                      Most Popular
                    </span>
                  )}
                  <span className="text-3xl">{plan.emoji}</span>
                  <h3 className="mt-4 font-serif text-xl text-forest">{plan.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-charcoal/65 leading-relaxed">{plan.tagline}</p>
                  <p className="mt-4 text-sm font-semibold text-gold-dark">
                    {fromPrice ? `From ${formatNaira(fromPrice)}/week` : "Pricing on request"}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest group-hover:gap-2.5 transition-all">
                    View Plan <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
