import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TestimonialsBar } from "@/components/sections/TestimonialsBar";
import { ProblemPromise } from "@/components/sections/ProblemPromise";
import { PlansPreview } from "@/components/sections/PlansPreview";
import { DifferenceGrid } from "@/components/sections/DifferenceGrid";
import { ExperienceStrip } from "@/components/sections/ExperienceStrip";
import { CorporateTeaser } from "@/components/sections/CorporateTeaser";
import { LeadMagnet } from "@/components/sections/LeadMagnet";
import { FinalCta } from "@/components/sections/FinalCta";
import { getPlans, getTestimonials, getContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Premium Healthy Meals, Delivered with Intention",
  description:
    "Freshly prepared, perfectly portioned meals for professionals, families, and everyone in between. Explore Norishé's six meal plans and start your wellness journey today.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [plans, testimonials, c] = await Promise.all([getPlans(), getTestimonials(), getContent()]);

  return (
    <>
      <Hero label={c.hero_label} headline={c.hero_headline} subhead={c.hero_subhead} quote={c.hero_quote} />
      <TestimonialsBar testimonials={testimonials} />
      <ProblemPromise headline={c.promise_headline} body={c.promise_body} />
      <PlansPreview plans={plans} />
      <DifferenceGrid />
      <ExperienceStrip quote={c.experience_quote} />
      <CorporateTeaser headline={c.corporate_teaser_headline} body={c.corporate_teaser_body} />
      <LeadMagnet headline={c.lead_magnet_headline} body={c.lead_magnet_body} />
      <FinalCta headline={c.final_cta_headline} subhead={c.final_cta_subhead} />
    </>
  );
}
