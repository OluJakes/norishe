import type { MetadataRoute } from "next";
import { getPlans } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://norishe.vip";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const plans = await getPlans();

  const staticRoutes = [
    "",
    "/about",
    "/plans",
    "/how-it-works",
    "/corporate",
    "/enroll",
    "/menu",
    "/faq",
    "/contact",
    "/legal/privacy",
    "/legal/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const planRoutes = plans.map((p) => ({
    url: `${SITE_URL}/plans/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...planRoutes];
}
