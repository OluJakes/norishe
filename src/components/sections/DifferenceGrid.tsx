import { Sparkles, Scale, ShieldCheck, Clock, PackageCheck } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const ITEMS = [
  { icon: Sparkles, title: "Premium Ingredients", copy: "Carefully sourced, quality-checked at every step." },
  { icon: Scale, title: "Balanced Nutrition", copy: "Macro-conscious recipes built by our nutrition team." },
  { icon: ShieldCheck, title: "Hygienic Preparation", copy: "Kitchen standards designed around food safety." },
  { icon: Clock, title: "Convenience", copy: "Delivered on your schedule, ready when you are." },
  { icon: PackageCheck, title: "Tamper-Evident Packaging", copy: "Sealed containers you can trust, every delivery." },
];

export function DifferenceGrid() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <Reveal>
          <SectionLabel center>The Norishé Difference</SectionLabel>
          <h2 className="text-center font-serif text-3xl text-forest sm:text-4xl">Why Clients Choose Us</h2>
        </Reveal>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest text-gold ring-4 ring-gold/10">
                  <item.icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <p className="mt-4 font-serif text-lg text-forest">{item.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-charcoal/60">{item.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
