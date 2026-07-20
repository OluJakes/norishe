import { CtaLink } from "@/components/ui/CtaLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Building2 } from "lucide-react";

export function CorporateTeaser({ headline, body }: { headline: string; body: string }) {
  return (
    <section className="bg-forest-dark py-20">
      <Container className="flex flex-col items-center gap-6 text-center">
        <Reveal>
          <Building2 className="mx-auto h-9 w-9 text-gold" strokeWidth={1.4} />
          <h2 className="mt-4 font-serif text-3xl text-ivory">{headline}</h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/70">
            {body}
          </p>
          <div className="mt-7">
            <CtaLink href="/corporate" label="corporate-teaser">Explore Corporate Wellness</CtaLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
