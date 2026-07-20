import { prisma } from "@/lib/prisma";
import { PLANS as STATIC_PLANS, type PlanSeed } from "@/lib/plans-content";
import { STATIC_TESTIMONIALS, STATIC_MENU, STATIC_SETTINGS, STATIC_FAQS } from "@/lib/static-content";
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content";

// This data-access layer tries Prisma first and gracefully falls back to
// static, seed-equivalent content if the database isn't reachable yet
// (e.g. first run, before `prisma migrate` has been executed). This keeps
// the public site resilient and lets it render correctly out of the box.

export type PlanWithTiers = {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  perfectFor: string[];
  sampleMenu: string[];
  philosophy: string;
  popular: boolean;
  tiers: { mealsPerWeek: number; billing: string; priceNaira: number }[];
};

function staticPlanToShape(p: PlanSeed): PlanWithTiers {
  return {
    slug: p.slug,
    name: p.name,
    emoji: p.emoji,
    tagline: p.tagline,
    description: p.description,
    perfectFor: p.perfectFor,
    sampleMenu: p.sampleMenu,
    philosophy: p.philosophy,
    popular: !!p.popular,
    tiers: p.tiers,
  };
}

export async function getPlans(): Promise<PlanWithTiers[]> {
  try {
    const plans = await prisma.plan.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: { tiers: { where: { active: true }, orderBy: { mealsPerWeek: "asc" } } },
    });
    if (plans.length === 0) throw new Error("empty");
    return plans.map((p: any) => ({
      slug: p.slug,
      name: p.name,
      emoji: p.emoji,
      tagline: p.tagline,
      description: p.description,
      perfectFor: JSON.parse(p.perfectFor),
      sampleMenu: JSON.parse(p.sampleMenu),
      philosophy: p.philosophy,
      popular: p.popular,
      tiers: p.tiers.map((t: any) => ({ mealsPerWeek: t.mealsPerWeek, billing: t.billing, priceNaira: t.priceNaira })),
    }));
  } catch {
    return STATIC_PLANS.map(staticPlanToShape);
  }
}

export async function getPlanBySlug(slug: string): Promise<PlanWithTiers | null> {
  const plans = await getPlans();
  return plans.find((p) => p.slug === slug) ?? null;
}

export async function getTestimonials() {
  try {
    const rows = await prisma.testimonial.findMany({ where: { visible: true }, orderBy: { createdAt: "desc" } });
    if (rows.length === 0) throw new Error("empty");
    return rows;
  } catch {
    return STATIC_TESTIMONIALS;
  }
}

export async function getMenuItems() {
  try {
    const rows = await prisma.menuItem.findMany({ orderBy: { createdAt: "desc" } });
    if (rows.length === 0) throw new Error("empty");
    return rows.map((r: any) => ({ ...r, planTags: JSON.parse(r.planTags) as string[] }));
  } catch {
    return STATIC_MENU;
  }
}

export async function getSettings() {
  try {
    const s = await prisma.settings.findUnique({ where: { id: "singleton" } });
    if (!s) throw new Error("missing");
    return s;
  } catch {
    return STATIC_SETTINGS;
  }
}

export async function getFaqItems() {
  try {
    const rows = await prisma.faqItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
    if (rows.length === 0) throw new Error("empty");
    return rows;
  } catch {
    return STATIC_FAQS;
  }
}

/**
 * Returns every admin-editable marketing-copy string, keyed the same way as
 * SITE_CONTENT_FIELDS. Any key without a saved override falls back to its
 * default from src/lib/site-content.ts, so pages can safely destructure this
 * without ever seeing `undefined`.
 */
export async function getContent(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteContent.findMany();
    if (rows.length === 0) throw new Error("empty");
    const overrides = Object.fromEntries(rows.map((r: any) => [r.key, r.value]));
    return { ...SITE_CONTENT_DEFAULTS, ...overrides };
  } catch {
    return SITE_CONTENT_DEFAULTS;
  }
}
