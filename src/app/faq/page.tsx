import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Accordion } from "@/components/Accordion";
import { CtaLink } from "@/components/ui/CtaLink";
import { getFaqItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about Norishé delivery areas, storage & reheating, allergies, pausing subscriptions, and payment options.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const items = await getFaqItems();
  const faqs = items.map((f: { question: string; answer: string }) => ({ q: f.question, a: f.answer }));

  return (
    <>
      <section className="bg-forest-gradient pt-40 pb-24 text-center">
        <Container>
          <SectionLabel light center>FAQ</SectionLabel>
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">Frequently Asked Questions</h1>
        </Container>
      </section>
      <section className="bg-cream py-20">
        <Container className="max-w-3xl">
          <Accordion items={faqs} />
          <div className="mt-14 text-center">
            <p className="text-charcoal/60">Still have questions?</p>
            <div className="mt-4"><CtaLink href="/contact" variant="outline-dark" label="faq-contact">Contact Us</CtaLink></div>
          </div>
        </Container>
      </section>
    </>
  );
}
