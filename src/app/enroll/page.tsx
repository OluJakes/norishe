import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EnrollWizard } from "@/components/enroll/EnrollWizard";

export const metadata: Metadata = {
  title: "Client Enrollment",
  description: "Enroll with Norishé in nine simple steps and get a personalized meal plan recommendation within 24–48 hours.",
  alternates: { canonical: "/enroll" },
};

export default function EnrollPage() {
  return (
    <>
      <section className="bg-forest-gradient pt-40 pb-20 text-center">
        <Container>
          <SectionLabel light center>Client Enrollment</SectionLabel>
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">Let's Build Your Plan</h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/75">
            Nine quick steps. Your progress saves automatically, so you can finish whenever suits you.
          </p>
        </Container>
      </section>
      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <Suspense fallback={<div className="mx-auto max-w-2xl rounded-xl2 bg-ivory p-10 text-center text-charcoal/50 shadow-soft">Loading enrollment form...</div>}>
            <EnrollWizard />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
