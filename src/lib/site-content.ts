// Registry of admin-editable marketing-copy blocks. Every entry here becomes
// a row in the SiteContent table (key/value) and a field in the
// /admin/content editor. Pages read their copy via getContent(key) in
// src/lib/data.ts, which falls back to the `defaultValue` below if the
// database isn't reachable or the row hasn't been created yet — so the
// site always renders correctly, and every string here is safely editable
// from the admin panel without a code change or redeploy.

export type SiteContentField = {
  key: string;
  label: string;
  group: string;
  type: "text" | "textarea";
  defaultValue: string;
};

export const SITE_CONTENT_FIELDS: SiteContentField[] = [
  // Homepage
  { key: "hero_label", label: "Hero eyebrow label", group: "Homepage — Hero", type: "text", defaultValue: "Premium Healthy Meal Delivery · Nigeria" },
  { key: "hero_headline", label: "Hero headline", group: "Homepage — Hero", type: "textarea", defaultValue: "Premium Healthy Meals, Delivered with Intention." },
  { key: "hero_subhead", label: "Hero subheading", group: "Homepage — Hero", type: "textarea", defaultValue: "Freshly prepared, perfectly portioned meals for professionals, families, and everyone in between." },
  { key: "hero_quote", label: "Hero card quote", group: "Homepage — Hero", type: "textarea", defaultValue: "Prepared with care, balance, and intention — just for you." },

  { key: "promise_headline", label: "Section headline", group: "Homepage — Problem & Promise", type: "textarea", defaultValue: "Many people want healthier lifestyles but face real barriers." },
  { key: "promise_body", label: "Section body copy", group: "Homepage — Problem & Promise", type: "textarea", defaultValue: "Limited time, inconsistent meal planning, poor nutritional choices, busy work schedules, and a lack of convenient healthy options stand between people and the way they want to eat. Norishé exists to remove those barriers — with thoughtfully prepared meals that support healthier living, delivered right to your door." },

  { key: "experience_quote", label: "Experience strip caption", group: "Homepage — Experience Strip", type: "textarea", defaultValue: "Prepared with care, balance, and intention — just for you." },

  { key: "lead_magnet_headline", label: "Headline", group: "Homepage — Lead Magnet", type: "textarea", defaultValue: "Get Our Free 7-Day Healthy Eating Guide" },
  { key: "lead_magnet_body", label: "Body copy", group: "Homepage — Lead Magnet", type: "textarea", defaultValue: "Not ready to enroll just yet? Start with practical, Norishé-approved guidance delivered straight to your inbox." },

  { key: "final_cta_headline", label: "Headline", group: "Homepage — Final CTA", type: "textarea", defaultValue: "Start Your Wellness Journey Today" },
  { key: "final_cta_subhead", label: "Subheading", group: "Homepage — Final CTA", type: "textarea", defaultValue: "Healthy living begins with one choice." },

  { key: "corporate_teaser_headline", label: "Headline", group: "Homepage — Corporate Teaser", type: "textarea", defaultValue: "Bring Norishé to Your Workplace" },
  { key: "corporate_teaser_body", label: "Body copy", group: "Homepage — Corporate Teaser", type: "textarea", defaultValue: "Corporate wellness programs that boost productivity, satisfaction, and workplace culture — one meal at a time." },

  // About page
  { key: "about_intro_headline", label: "Intro headline", group: "About Page", type: "textarea", defaultValue: "Healthy eating shouldn't be this hard." },
  { key: "about_intro_body_1", label: "Intro paragraph 1", group: "About Page", type: "textarea", defaultValue: "Limited time, inconsistent meal planning, poor nutritional choices, busy work schedules, and a lack of convenient healthy options — these are the everyday realities that stand between people and the way they actually want to live and eat." },
  { key: "about_intro_body_2", label: "Intro paragraph 2", group: "About Page", type: "textarea", defaultValue: "Norishé was created to solve these challenges through thoughtfully prepared meals that support healthier living — without asking anyone to sacrifice their time, their schedule, or their standards." },
  { key: "about_mission", label: "Mission statement", group: "About Page", type: "textarea", defaultValue: "To make healthy eating simple, enjoyable, and sustainable." },
  { key: "about_vision", label: "Vision statement", group: "About Page", type: "textarea", defaultValue: "To become Nigeria's most trusted healthy meal brand." },

  // How It Works
  { key: "food_safety_closing", label: "Closing note under Food-Safety Promise", group: "How It Works Page", type: "textarea", defaultValue: "Every Norishé meal arrives in tamper-evident sealed packaging — so you know it's exactly as prepared, from our kitchen to your door." },

  // Corporate page
  { key: "corporate_hero_subhead", label: "Hero subheading", group: "Corporate Page", type: "textarea", defaultValue: "Workplace meal programs designed to keep your team energized, healthy, and appreciated." },
  { key: "corporate_form_intro", label: "Form intro copy", group: "Corporate Page", type: "textarea", defaultValue: "Tell us about your team and we'll put together a tailored proposal — including menu options, delivery logistics, and pricing for your headcount." },

  // Footer
  { key: "footer_tagline", label: "Footer tagline (under logo)", group: "Footer", type: "textarea", defaultValue: "Prepared with care, balance, and intention — just for you." },
  { key: "footer_credit", label: "Footer credit line (after copyright)", group: "Footer", type: "text", defaultValue: "Designed and Managed by GreyFusion®™ IT" },
];

export const SITE_CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  SITE_CONTENT_FIELDS.map((f) => [f.key, f.defaultValue])
);
