import { Sparkles, Salad, ShieldCheck, Truck, Award, HeartHandshake } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const PROMISES = [
  { icon: Salad, title: "Freshness", copy: "Ingredients sourced and prepared close to your delivery window." },
  { icon: HeartHandshake, title: "Nutrition", copy: "Every meal is portioned and balanced with intention." },
  { icon: ShieldCheck, title: "Safety", copy: "Hygienic preparation and tamper-evident sealed packaging." },
  { icon: Truck, title: "Convenience", copy: "Reliable delivery that fits around your schedule." },
  { icon: Award, title: "Quality", copy: "Premium ingredients, consistent execution, every time." },
  { icon: Sparkles, title: "Care", copy: "Thoughtful presentation, from the box to the plate." },
];

export function ProblemPromise({ headline, body }: { headline: string; body: string }) {
  return (
    <section className="bg-ivory py-24">
      <Container className="grid gap-14 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <SectionLabel>The Norishé Promise</SectionLabel>
          <h2 className="font-serif text-3xl leading-tight text-forest sm:text-4xl">
            {headline}
          </h2>
          <p className="mt-5 text-charcoal/70 leading-relaxed">
            {body}
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {PROMISES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-gold">
                  <p.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <p className="mt-3 font-serif text-forest">{p.title}</p>
                <p className="mt-1 text-xs text-charcoal/60 leading-relaxed">{p.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
