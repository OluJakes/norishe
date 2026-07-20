// Static fallback content mirrors prisma/seed.ts. Used by src/lib/data.ts
// whenever the database is unreachable (e.g. before first migration) so the
// site still renders correctly out of the box.

export const STATIC_TESTIMONIALS = [
  { id: "t1", name: "Adaeze O.", role: "Marketing Director, Abuja", quote: "Norishé took meal planning completely off my plate. The Executive plan tastes like something from a five-star kitchen — and it's actually good for me.", rating: 5, visible: true },
  { id: "t2", name: "Tunde A.", role: "Founder, Fintech Startup", quote: "I've tried three other meal delivery services in Abuja. None of them come close to the presentation and consistency of Norishé.", rating: 5, visible: true },
  { id: "t3", name: "Ngozi E.", role: "Working Mother of Three", quote: "The Family plan has genuinely changed our weeknights. My kids ask for the jollof rice by name.", rating: 5, visible: true },
  { id: "t4", name: "Chidi K.", role: "Fitness Coach", quote: "Recommending the Muscle Gain plan to my clients was an easy call — the protein numbers actually add up.", rating: 4, visible: true },
  { id: "t5", name: "Folake B.", role: "HR Lead, Corporate Client", quote: "Rolling out Norishé's corporate wellness program was the easiest 'yes' our leadership team gave all year.", rating: 5, visible: true },
  { id: "t6", name: "Emeka N.", role: "Fat Loss Plan Member", quote: "Down 8kg in ten weeks without ever feeling like I was 'on a diet.' That's the Norishé difference.", rating: 5, visible: true },
];

export const STATIC_MENU = [
  { id: "m1", name: "Lemon-Herb Grilled Chicken & Coconut Veg Rice", imageUrl: "/images/dish-bowl-herb.jpg", planTags: ["fat-loss", "wellness-maintenance"], calories: 480, protein: 38 },
  { id: "m2", name: "Grilled Salmon with Quinoa & Roasted Vegetables", imageUrl: "/images/dish-plate-full.jpg", planTags: ["wellness-maintenance", "executive"], calories: 520, protein: 41 },
  { id: "m3", name: "Double Chicken Breast with Brown Rice & Broccoli", imageUrl: "/images/dish-grilled-avocado.jpg", planTags: ["muscle-gain"], calories: 610, protein: 58 },
  { id: "m4", name: "Slow-Braised Beef with Root Vegetable Medley", imageUrl: "/images/hero-bowl-1.jpg", planTags: ["executive"], calories: 560, protein: 44 },
  { id: "m5", name: "Family-Style Jollof Rice with Grilled Chicken", imageUrl: "/images/dish-containers-top.jpg", planTags: ["family"], calories: 540, protein: 36 },
  { id: "m6", name: "Baked Fish with Steamed Vegetables & Cauliflower Rice", imageUrl: "/images/packaging-branded-container.jpg", planTags: ["fat-loss"], calories: 390, protein: 34 },
  { id: "m7", name: "Beef Stir-Fry with Whole Wheat Noodles", imageUrl: "/images/lifestyle-eating.jpg", planTags: ["muscle-gain"], calories: 590, protein: 46 },
  { id: "m8", name: "Vegetable Fried Rice with Grilled Turkey", imageUrl: "/images/dish-bowl-herb.jpg", planTags: ["family", "wellness-maintenance"], calories: 470, protein: 30 },
  { id: "m9", name: "Herb Butter Salmon with Asparagus", imageUrl: "/images/dish-plate-full.jpg", planTags: ["executive", "custom"], calories: 530, protein: 40 },
];

export const STATIC_SETTINGS = {
  phone: "+234 706 180 8293",
  email: "hello@norishe.vip",
  whatsapp: "2347061808293",
  instagram: "norishe.vip",
  address: "15 Kainji Crescent, off Lake Chad Crescent, Maitama, Abuja, Nigeria",
  deliveryNote: "Currently delivering across Abuja, with select zones in other major Nigerian cities — confirm coverage at enrollment.",
  announcementBanner: null as string | null,
};

export const STATIC_FAQS = [
  { id: "f1", question: "Where do you deliver?", answer: "We're based in Maitama, Abuja, and currently deliver across Abuja, with select delivery zones in other major cities. Enter your address at enrollment and we'll confirm coverage.", order: 0, visible: true },
  { id: "f2", question: "How should I store and reheat my meals?", answer: "Refrigerate immediately on arrival. Meals are best consumed within 24–48 hours. Reheat by microwaving or steaming gently — do not overheat, as this can affect taste and texture.", order: 1, visible: true },
  { id: "f3", question: "What if I have food allergies?", answer: "Let us know during enrollment. Every plan — especially our Custom Plan — can be adjusted around allergies, intolerances, and medical dietary needs.", order: 2, visible: true },
  { id: "f4", question: "Can I pause my subscription?", answer: "Yes. Pausing is easy — just reach out via WhatsApp, phone, or email at least 48 hours before your next delivery.", order: 3, visible: true },
  { id: "f5", question: "What payment options are available?", answer: "We accept bank transfer, payment on delivery, and (where enabled) card payment via Paystack. Your enrollment confirmation will include full payment instructions.", order: 4, visible: true },
  { id: "f6", question: "How far in advance should I enroll?", answer: "We recommend enrolling at least 48 hours before your desired start date so our team can prepare your personalized recommendation.", order: 5, visible: true },
];
