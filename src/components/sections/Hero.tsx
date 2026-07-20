import Image from "next/image";
import { CtaLink } from "@/components/ui/CtaLink";
import { Leaf, HeartHandshake, ShieldCheck } from "lucide-react";

export function Hero({
  label,
  headline,
  subhead,
  quote,
}: {
  label: string;
  headline: string;
  subhead: string;
  quote: string;
}) {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-forest-gradient pt-28 pb-20">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/hero-bowl-1.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/70 to-forest-dark/40" />
      <div className="container-nrs relative z-10 grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="label-caps text-gold-light">{label}</p>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-ivory sm:text-5xl lg:text-6xl">
            {headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/80">
            {subhead}
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <CtaLink href="/plans" label="hero-explore-plans">Explore Meal Plans</CtaLink>
            <CtaLink href="/how-it-works" variant="outline" label="hero-how-it-works">How It Works</CtaLink>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-cream/70">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-label">
              <Leaf className="h-4 w-4 text-gold" /> Fresh
            </span>
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-label">
              <HeartHandshake className="h-4 w-4 text-gold" /> Nutritious
            </span>
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-label">
              <ShieldCheck className="h-4 w-4 text-gold" /> Trusted
            </span>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl2 shadow-soft ring-1 ring-gold/20">
            <Image
              src="/images/packaging-branded-container.jpg"
              alt="Norishé branded meal container, prepared with care"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 w-48 rounded-xl2 bg-ivory p-4 shadow-soft">
            <p className="font-serif text-sm text-forest">"{quote}"</p>
          </div>
        </div>
      </div>
    </section>
  );
}
