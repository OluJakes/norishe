import type { Metadata } from "next";
import { TrendingUp, Smile, Building, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { CorporateForm } from "@/components/forms/CorporateForm";
import { getContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Corporate Wellness",
  description:
    "Bring Norishé's workplace meal programs to your team — improved productivity, better employee satisfaction, enhanced workplace culture, and convenient meal solutions.",
  alternates: { canonical: "/corporate" },
};

const BENEFITS = [
  { icon: TrendingUp, title: "Improved Productivity", copy: "Well-nourished teams stay focused for longer." },
  { icon: Smile, title: "Better Employee Satisfaction", copy: "A benefit your team will actually use and appreciate." },
  { icon: Building, title: "Enhanced Workplace Culture", copy: "Show your team wellness is a genuine priority." },
  { icon: Truck, title: "Convenient Meal Solutions", copy: "Reliable delivery straight to your office." },
];

export default async function CorporatePage() {
  const c = await getContent();
  return (
    <>
      <section className="bg-forest-gradient pt-40 pb-24 text-center">
        <Container>
          <SectionLabel light center>Corporate Wellness</SectionLabel>
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">Bring Norishé to Your Workplace</h1>
          <p className="mx-auto mt-5 max-w-xl text-cream/75">
            {c.corporate_hero_subhead}
          </p>
        </Container>
      </section>

      <section className="bg-ivory py-24">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest text-gold ring-4 ring-gold/10">
                    <b.icon className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <p className="mt-4 font-serif text-lg text-forest">{b.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-charcoal/60">{b.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cream py-24">
        <Container className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <SectionLabel>Get Started</SectionLabel>
            <h2 className="font-serif text-3xl text-forest sm:text-4xl">Request a Corporate Proposal</h2>
            <p className="mt-4 text-charcoal/65 leading-relaxed">
              {c.corporate_form_intro}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <CorporateForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
