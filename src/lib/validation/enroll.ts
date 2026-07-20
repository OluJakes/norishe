import { z } from "zod";

// Shared Zod schema for the 9-section enrollment wizard, used by both the
// client-side form (React Hook Form) and the /api/enroll route handler.

export const step1Schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Please select your date of birth"),
  gender: z.string().min(1, "Please select a gender"),
  occupation: z.string().min(1, "Please enter your occupation"),
  city: z.string().min(1, "Please enter your city"),
  state: z.string().min(1, "Please enter your state"),
  emergencyContact: z.string().optional(),
});

export const step2Schema = z.object({
  reasons: z.array(z.string()).min(1, "Select at least one reason"),
  topGoals: z.string().min(2, "Tell us your top goals"),
  motivation: z.number().min(1).max(5),
});

export const step3Schema = z.object({
  height: z.string().min(1, "Please enter your height"),
  currentWeight: z.string().min(1, "Please enter your current weight"),
  targetWeight: z.string().min(1, "Please enter your target weight"),
  medicalConditions: z.string().optional(),
  medicationsSupplements: z.string().optional(),
  allergies: z.string().optional(),
  pregnantOrBreastfeeding: z.string().optional(),
});

export const step4Schema = z.object({
  activityLevel: z.string().min(1, "Please select an activity level"),
  exerciseDays: z.number().min(0).max(7),
  sleepHours: z.string().min(1, "Please select sleep hours"),
  stressLevel: z.string().min(1, "Please select a stress level"),
});

export const step5Schema = z.object({
  mealsPerDay: z.number().min(1).max(10),
  breakfastFrequency: z.string().min(1),
  eatOutFrequency: z.string().min(1),
  snackFrequency: z.string().min(1),
  waterIntake: z.string().min(1),
});

export const step6Schema = z.object({
  foodsLoved: z.string().optional(),
  foodsDisliked: z.string().optional(),
  foodsNeverEaten: z.string().optional(),
  preferredProteins: z.string().optional(),
  preferredCarbs: z.string().optional(),
  favouriteVeggies: z.string().optional(),
  favouriteFruits: z.string().optional(),
  spiceLevel: z.string().min(1, "Please select a spice level"),
});

export const step7Schema = z.object({
  interestedPlan: z.string().optional(),
  mealsNeeded: z.number().min(1).max(30),
  deliveryDays: z.number().min(1).max(7),
  preferredTime: z.string().min(1, "Please select a preferred delivery time"),
});

export const step8Schema = z.object({
  deliveryAddress: z.string().min(5, "Please enter your delivery address"),
  deliveryInstructions: z.string().optional(),
  contactMethod: z.string().min(1, "Please select a contact method"),
});

export const step9Schema = z.object({
  consentAccurate: z.literal(true, { errorMap: () => ({ message: "Required to continue" }) }),
  consentAdvice: z.literal(true, { errorMap: () => ({ message: "Required to continue" }) }),
  consentContact: z.literal(true, { errorMap: () => ({ message: "Required to continue" }) }),
});

export const enrollSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(step6Schema)
  .merge(step7Schema)
  .merge(step8Schema)
  .merge(step9Schema);

export type EnrollFormData = z.infer<typeof enrollSchema>;

export const STEP_SCHEMAS = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
  step9Schema,
];

export const REASON_OPTIONS = [
  "Weight Loss",
  "Weight Maintenance",
  "Muscle Building",
  "Healthy Lifestyle",
  "Better Energy",
  "Improved Digestion",
  "Managing a Medical Condition",
  "Busy Professional Meal Support",
  "Family Nutrition",
  "Other",
];
