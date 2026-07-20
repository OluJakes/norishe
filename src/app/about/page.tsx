import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { CtaLink } from "@/components/ui/CtaLink";
import { HeartHandshake, Award, ShieldCheck, Sparkles, Lightbulb } from "lucide-react";
import { getContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Why Norishé exists: solving the real barriers to healthy eating in Nigeria with thoughtfully prepared meals, mission-driven values, and a vision to become Nigeria's most trusted healthy meal brand.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { icon: HeartHandshake, title: "Wellness First", copy: "Every decision starts with what's genuinely good for our clients." },
  { icon: Award, title: "Excellence", copy: "Consistent quality in every meal, every delivery, every time." },
  { icon: ShieldCheck, title: "Integrity", copy: "Honest ingredients, honest labeling, honest service." },
  { icon: Sparkles, title: "Care", copy: "Thoughtful preparation and presentation, from kitchen to doorstep." },
  { icon: Lightbulb, title: "Innovation", copy: "Constantly refining our recipes, packaging, and processes." },
];

export default async function AboutPage() {
  const c = await getContent();
  return (
    <>
      <section className="relative bg-forest-gradient pt-40 pb-24 text-center">
        <Container>
          <SectionLabel light center>Our Story</SectionLabel>
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">Why Norishé Exists</h1>
        </Container>
      </section>

      <section className="bg-ivory py-24">
        <Container className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl2 shadow-soft">
              <Image src="/images/lifestyle-eating.jpg" alt="A Norishé meal, freshly prepared" fill className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionLabel>The Challenge</SectionLabel>
            <h2 className="font-serif text-3xl text-forest sm:text-4xl">
              {c.about_intro_headline}
            </h2>
            <p className="mt-5 text-charcoal/70 leading-relaxed">
              {c.about_intro_body_1}
            </p>
            <p className="mt-4 text-charcoal/70 leading-relaxed">
              {c.about_intro_body_2}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-cream py-24">
        <Container className="grid gap-10 sm:grid-cols-2">
          <Reveal>
            <div className="card-ivory h-full p-9">
              <SectionLabel>Our Mission</SectionLabel>
              <p className="font-serif text-2xl text-forest leading-snug">
                {c.about_mission}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card-ivory h-full p-9">
              <SectionLabel>Our Vision</SectionLabel>
              <p className="font-serif text-2xl text-forest leading-snug">
                {c.about_vision}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ivory py-24">
        <Container>
          <Reveal>
            <SectionLabel center>What We Stand For</SectionLabel>
            <h2 className="text-center font-serif text-3xl text-forest sm:text-4xl">Our Core Values</h2>
          </Reveal>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest text-gold ring-4 ring-gold/10">
                    <v.icon className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <p className="mt-4 font-serif text-lg text-forest">{v.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-charcoal/60">{v.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-forest-gradient py-20 text-center">
        <Container>
          <h2 className="font-serif text-3xl text-ivory sm:text-4xl">Ready to Experience the Difference?</h2>
          <div className="mt-7"><CtaLink href="/enroll" label="about-cta">Start Your Plan</CtaLink></div>
        </Container>
      </section>
    </>
  );
}
