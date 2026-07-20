import type { Metadata } from "next";
import { ClipboardList, ChefHat, Truck, Sparkles, ShieldCheck, Thermometer, PackageCheck, Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { CtaLink } from "@/components/ui/CtaLink";
import { getContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From enrollment to delivery: see the four-step Norishé journey and our food-safety promise — careful sourcing, hygienic preparation, quality control, and tamper-evident sealed packaging.",
  alternates: { canonical: "/how-it-works" },
};

const STEPS = [
  { icon: ClipboardList, num: "01", title: "Enroll & Tell Us Your Goals", copy: "Complete our enrollment profile — your wellness goals, health details, food preferences, and delivery needs." },
  { icon: ChefHat, num: "02", title: "We Craft Your Personalized Plan", copy: "Our nutrition team builds a recommendation tailored to your profile and preferred meal plan." },
  { icon: Truck, num: "03", title: "Freshly Prepared, Sealed & Delivered", copy: "Meals are prepared close to your delivery window and arrive sealed, labeled, and ready to enjoy." },
  { icon: Sparkles, num: "04", title: "Nourish, Power, Thrive", copy: "Enjoy consistent, balanced meals — and adjust your plan anytime as your goals evolve." },
];

const SAFETY = [
  { icon: Search, title: "Careful Ingredient Sourcing", copy: "We select quality ingredients from trusted, vetted suppliers." },
  { icon: ShieldCheck, title: "Hygienic Preparation", copy: "Every meal is prepared under strict kitchen hygiene standards." },
  { icon: Thermometer, title: "Proper Storage", copy: "Cold-chain handling from kitchen to delivery." },
  { icon: PackageCheck, title: "Quality Control Checks", copy: "Every batch is checked before it leaves our kitchen." },
];

export default async function HowItWorksPage() {
  const c = await getContent();
  return (
    <>
      <section className="bg-forest-gradient pt-40 pb-24 text-center">
        <Container>
          <SectionLabel light center>How It Works</SectionLabel>
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">Your Journey to Nourishment</h1>
        </Container>
      </section>

      <section className="bg-ivory py-24">
        <Container>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.08}>
                <div className="relative rounded-xl2 bg-cream p-7">
                  <span className="font-serif text-4xl text-gold/40">{s.num}</span>
                  <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-full bg-forest text-gold">
                    <s.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <p className="mt-4 font-serif text-lg text-forest">{s.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{s.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-forest-dark py-24">
        <Container>
          <Reveal>
            <SectionLabel light center>Our Promise</SectionLabel>
            <h2 className="text-center font-serif text-3xl text-ivory sm:text-4xl">The Norishé Food-Safety Promise</h2>
          </Reveal>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SAFETY.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-gold ring-1 ring-gold/20">
                    <s.icon className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <p className="mt-4 font-serif text-lg text-ivory">{s.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-cream/60">{s.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-cream/60">
            {c.food_safety_closing}
          </p>
        </Container>
      </section>

      <section className="bg-forest-gradient py-20 text-center">
        <Container>
          <h2 className="font-serif text-3xl text-ivory sm:text-4xl">Ready to Begin?</h2>
          <div className="mt-7"><CtaLink href="/enroll" label="how-it-works-cta">Start Your Plan</CtaLink></div>
        </Container>
      </section>
    </>
  );
}
