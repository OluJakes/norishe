import { CtaLink } from "@/components/ui/CtaLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta({ headline, subhead }: { headline: string; subhead: string }) {
  return (
    <section className="bg-forest-gradient py-24">
      <Container className="text-center">
        <Reveal>
          <h2 className="font-serif text-3xl text-ivory sm:text-4xl">{headline}</h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/75">
            {subhead}
          </p>
          <div className="mt-8">
            <CtaLink href="/enroll" label="final-cta-enroll">Start Your Plan</CtaLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
