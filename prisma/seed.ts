import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PLANS } from "../src/lib/plans-content";
import { SITE_CONTENT_FIELDS } from "../src/lib/site-content";
import { STATIC_FAQS } from "../src/lib/static-content";

const prisma = new PrismaClient();

const TESTIMONIALS = [
  { name: "Adaeze O.", role: "Marketing Director, Abuja", quote: "Norishé took meal planning completely off my plate. The Executive plan tastes like something from a five-star kitchen — and it's actually good for me.", rating: 5 },
  { name: "Tunde A.", role: "Founder, Fintech Startup", quote: "I've tried three other meal delivery services in Abuja. None of them come close to the presentation and consistency of Norishé.", rating: 5 },
  { name: "Ngozi E.", role: "Working Mother of Three", quote: "The Family plan has genuinely changed our weeknights. My kids ask for the jollof rice by name.", rating: 5 },
  { name: "Chidi K.", role: "Fitness Coach", quote: "Recommending the Muscle Gain plan to my clients was an easy call — the protein numbers actually add up.", rating: 4 },
  { name: "Folake B.", role: "HR Lead, Corporate Client", quote: "Rolling out Norishé's corporate wellness program was the easiest 'yes' our leadership team gave all year.", rating: 5 },
  { name: "Emeka N.", role: "Fat Loss Plan Member", quote: "Down 8kg in ten weeks without ever feeling like I was 'on a diet.' That's the Norishé difference.", rating: 5 },
];

const MENU_ITEMS = [
  { name: "Lemon-Herb Grilled Chicken & Coconut Veg Rice", planTags: ["fat-loss", "wellness-maintenance"], calories: 480, protein: 38 },
  { name: "Grilled Salmon with Quinoa & Roasted Vegetables", planTags: ["wellness-maintenance", "executive"], calories: 520, protein: 41 },
  { name: "Double Chicken Breast with Brown Rice & Broccoli", planTags: ["muscle-gain"], calories: 610, protein: 58 },
  { name: "Slow-Braised Beef with Root Vegetable Medley", planTags: ["executive"], calories: 560, protein: 44 },
  { name: "Family-Style Jollof Rice with Grilled Chicken", planTags: ["family"], calories: 540, protein: 36 },
  { name: "Baked Fish with Steamed Vegetables & Cauliflower Rice", planTags: ["fat-loss"], calories: 390, protein: 34 },
  { name: "Beef Stir-Fry with Whole Wheat Noodles", planTags: ["muscle-gain"], calories: 590, protein: 46 },
  { name: "Vegetable Fried Rice with Grilled Turkey", planTags: ["family", "wellness-maintenance"], calories: 470, protein: 30 },
  { name: "Herb Butter Salmon with Asparagus", planTags: ["executive", "custom"], calories: 530, protein: 40 },
];

async function main() {
  // Admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@norishe.vip";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Norishe#Admin2026";
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Norishé Admin",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      mustChangePwd: true,
    },
  });
  console.log(`\nSeeded admin account:\n  email: ${adminEmail}\n  password: ${adminPassword}\n  (forced password change on first login)\n`);

  // Plans + tiers
  for (let i = 0; i < PLANS.length; i++) {
    const p = PLANS[i];
    const plan = await prisma.plan.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        emoji: p.emoji,
        tagline: p.tagline,
        description: p.description,
        perfectFor: JSON.stringify(p.perfectFor),
        sampleMenu: JSON.stringify(p.sampleMenu),
        philosophy: p.philosophy,
        order: i,
        popular: !!p.popular,
      },
      create: {
        slug: p.slug,
        name: p.name,
        emoji: p.emoji,
        tagline: p.tagline,
        description: p.description,
        perfectFor: JSON.stringify(p.perfectFor),
        sampleMenu: JSON.stringify(p.sampleMenu),
        philosophy: p.philosophy,
        order: i,
        popular: !!p.popular,
      },
    });
    await prisma.planTier.deleteMany({ where: { planId: plan.id } });
    for (const t of p.tiers) {
      await prisma.planTier.create({
        data: {
          planId: plan.id,
          mealsPerWeek: t.mealsPerWeek,
          billing: t.billing,
          priceNaira: t.priceNaira,
        },
      });
    }
  }

  // Testimonials
  const existingT = await prisma.testimonial.count();
  if (existingT === 0) {
    for (const t of TESTIMONIALS) await prisma.testimonial.create({ data: t });
  }

  // Menu items
  const existingM = await prisma.menuItem.count();
  if (existingM === 0) {
    for (const m of MENU_ITEMS) {
      await prisma.menuItem.create({
        data: { name: m.name, planTags: JSON.stringify(m.planTags), calories: m.calories, protein: m.protein },
      });
    }
  }

  // Settings singleton
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // FAQ items
  const existingF = await prisma.faqItem.count();
  if (existingF === 0) {
    for (const f of STATIC_FAQS) {
      await prisma.faqItem.create({
        data: { question: f.question, answer: f.answer, order: f.order, visible: f.visible },
      });
    }
  }

  // Site content (marketing copy blocks) — only seed keys that don't exist
  // yet, so re-running seed never clobbers copy already edited in admin.
  for (const field of SITE_CONTENT_FIELDS) {
    await prisma.siteContent.upsert({
      where: { key: field.key },
      update: {},
      create: { key: field.key, value: field.defaultValue },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
