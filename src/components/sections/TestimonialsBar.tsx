import { Star } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

type Testimonial = { id: string; name: string; role: string | null; quote: string; rating: number };

export function TestimonialsBar({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="bg-cream py-20">
      <Container>
        <Reveal>
          <SectionLabel center>Trusted By Busy Professionals, Families & Corporate Teams</SectionLabel>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06}>
              <div className="card-ivory h-full p-6">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-3.5 w-3.5" fill={idx < t.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-charcoal/80">"{t.quote}"</p>
                <p className="mt-5 font-serif text-forest">{t.name}</p>
                {t.role && <p className="text-xs text-charcoal/50">{t.role}</p>}
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-charcoal/40">
          Testimonials shown are illustrative placeholders — editable anytime from the admin panel.
        </p>
      </Container>
    </section>
  );
}
