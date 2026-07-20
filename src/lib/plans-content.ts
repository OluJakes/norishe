// Canonical seed content for the six Norishé meal plans.
// Used by prisma/seed.ts. Prices are placeholders — TODO: owner sets real
// prices in the admin Plans & Pricing manager.

export type PlanSeed = {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  perfectFor: string[];
  sampleMenu: string[];
  philosophy: string;
  popular?: boolean;
  tiers: { mealsPerWeek: number; billing: "weekly" | "monthly"; priceNaira: number }[];
};

export const PLANS: PlanSeed[] = [
  {
    slug: "fat-loss",
    name: "Fat Loss Plan",
    emoji: "🔥",
    tagline: "Lose weight the healthy way — without sacrificing flavor.",
    description:
      "Calorie-controlled meals rich in lean protein, high in fiber, and balanced with wholesome carbohydrates and healthy fats — designed to support sustainable, satisfying weight loss.",
    perfectFor: [
      "Healthy weight loss",
      "Fat reduction",
      "Portion control",
      "Sustainable lifestyle changes",
    ],
    sampleMenu: [
      "Lemon-Herb Grilled Chicken & Coconut Veg Rice",
      "Baked Fish with Steamed Vegetables & Cauliflower Rice",
      "Grilled Turkey Salad with Citrus Vinaigrette",
      "Peppered Beef Strips with Sautéed Greens",
      "Herb-Crusted Chicken with Sweet Potato Mash",
    ],
    philosophy:
      "We build every Fat Loss meal around a calorie target and a protein floor, so you stay full and energized while your body does the work.",
    tiers: [
      { mealsPerWeek: 5, billing: "weekly", priceNaira: 35000 },
      { mealsPerWeek: 10, billing: "weekly", priceNaira: 65000 },
      { mealsPerWeek: 15, billing: "weekly", priceNaira: 90000 },
    ],
  },
  {
    slug: "wellness-maintenance",
    name: "Wellness & Maintenance Plan",
    emoji: "🌿",
    tagline: "Healthy eating made effortless.",
    description:
      "Nutrient-rich, balanced meals that support everyday wellness for people busy with work, school, or family — no compromises, no complications.",
    perfectFor: [
      "Maintaining a healthy weight",
      "Balanced nutrition",
      "Busy lifestyles",
      "Everyday wellness",
    ],
    sampleMenu: [
      "Grilled Salmon with Quinoa & Roasted Vegetables",
      "Jollof Brown Rice with Herb Chicken",
      "Vegetable Stir-Fry with Tofu & Brown Rice",
      "Beef & Vegetable Skewers with Couscous",
      "Moi Moi with Grilled Fish & Greens",
    ],
    philosophy:
      "Maintenance is about consistency, not restriction. These meals hit balanced macros so wellness fits naturally into your week.",
    tiers: [
      { mealsPerWeek: 5, billing: "weekly", priceNaira: 32000 },
      { mealsPerWeek: 10, billing: "weekly", priceNaira: 60000 },
      { mealsPerWeek: 15, billing: "weekly", priceNaira: 85000 },
    ],
  },
  {
    slug: "muscle-gain",
    name: "Muscle Gain Plan",
    emoji: "💪",
    tagline: "Fuel your body. Build your strength.",
    description:
      "Higher-protein meals, strategically portioned for energy, recovery, growth, and consistent progress toward your performance goals.",
    perfectFor: [
      "Building lean muscle",
      "Gym enthusiasts",
      "Fitness goals",
      "Recovery and performance",
    ],
    sampleMenu: [
      "Double Chicken Breast with Brown Rice & Broccoli",
      "Grilled Steak with Sweet Potato & Asparagus",
      "Egg White & Turkey Bacon Power Bowl",
      "Baked Salmon with Quinoa & Spinach",
      "Beef Stir-Fry with Whole Wheat Noodles",
    ],
    philosophy:
      "We front-load protein and complex carbohydrates so every meal supports recovery and consistent training progress.",
    tiers: [
      { mealsPerWeek: 5, billing: "weekly", priceNaira: 38000 },
      { mealsPerWeek: 10, billing: "weekly", priceNaira: 70000 },
      { mealsPerWeek: 15, billing: "weekly", priceNaira: 98000 },
    ],
  },
  {
    slug: "executive",
    name: "Executive Meal Plan",
    emoji: "👔",
    tagline: "Premium nutrition for professionals on the move.",
    description:
      "Beautifully prepared, nutrient-dense meals delivered with a premium, unboxing-worthy experience — for people whose time is their most valuable asset.",
    perfectFor: [
      "Executives",
      "Entrepreneurs",
      "Corporate professionals",
      "Busy schedules",
    ],
    sampleMenu: [
      "Lemon-Herb Grilled Turkey & Coconut Veg Rice",
      "Pan-Seared Fish with Truffle-Herb Cauliflower Mash",
      "Grilled Chicken with Mediterranean Quinoa",
      "Slow-Braised Beef with Root Vegetable Medley",
      "Herb Butter Salmon with Asparagus",
    ],
    philosophy:
      "Executive meals are curated for consistency and presentation — the same quality whether it's a boardroom lunch or a quiet dinner at home.",
    popular: true,
    tiers: [
      { mealsPerWeek: 5, billing: "weekly", priceNaira: 45000 },
      { mealsPerWeek: 10, billing: "weekly", priceNaira: 85000 },
      { mealsPerWeek: 15, billing: "weekly", priceNaira: 120000 },
    ],
  },
  {
    slug: "family",
    name: "Family Meal Plan",
    emoji: "👨‍👩‍👧‍👦",
    tagline: "Wholesome meals the whole family can enjoy.",
    description:
      "Generous portions and balanced recipes designed for the whole household — one less thing to plan during a busy week.",
    perfectFor: [
      "Families",
      "Weekly meal planning",
      "Healthy home dining",
      "Convenient family meals",
    ],
    sampleMenu: [
      "Family-Style Jollof Rice with Grilled Chicken",
      "Beef Stew with Steamed Rice & Vegetables",
      "Baked Fish with Yam & Garden Vegetables",
      "Chicken Pasta Bake with Side Salad",
      "Vegetable Fried Rice with Grilled Turkey",
    ],
    philosophy:
      "Family meals balance nutrition with familiarity — recipes everyone at the table will actually look forward to.",
    tiers: [
      { mealsPerWeek: 10, billing: "weekly", priceNaira: 95000 },
      { mealsPerWeek: 15, billing: "weekly", priceNaira: 135000 },
      { mealsPerWeek: 20, billing: "weekly", priceNaira: 170000 },
    ],
  },
  {
    slug: "custom",
    name: "Custom Plan",
    emoji: "✨",
    tagline: "Because your nutrition should be as unique as you are.",
    description:
      "Tailored to your personal goals, dietary preferences, allergies, medical considerations, and lifestyle — built around you, not a template.",
    perfectFor: [
      "Personalized nutrition",
      "Food allergies or sensitivities",
      "Medical dietary requirements",
      "Individual fitness and wellness goals",
    ],
    sampleMenu: [
      "Menu curated after your enrollment consultation",
      "Adjusted weekly based on your feedback",
      "Built around your allergies & preferences",
      "Aligned to your specific health goals",
    ],
    philosophy:
      "Every Custom Plan starts with your enrollment profile and a follow-up consultation — nutrition designed around your body, not the other way around.",
    tiers: [
      { mealsPerWeek: 5, billing: "weekly", priceNaira: 40000 },
      { mealsPerWeek: 10, billing: "weekly", priceNaira: 75000 },
      { mealsPerWeek: 15, billing: "weekly", priceNaira: 105000 },
    ],
  },
];
