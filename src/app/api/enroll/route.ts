import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enrollSchema } from "@/lib/validation/enroll";
import { sendEmail, adminNotificationEmail, welcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = enrollSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission", issues: parsed.error.flatten() }, { status: 400 });
    }
    const d = parsed.data;

    const enrollment = await prisma.enrollment.create({
      data: {
        fullName: d.fullName,
        email: d.email,
        phone: d.phone,
        dateOfBirth: d.dateOfBirth,
        gender: d.gender,
        occupation: d.occupation,
        city: d.city,
        state: d.state,
        emergencyContact: d.emergencyContact,

        reasons: JSON.stringify(d.reasons),
        topGoals: d.topGoals,
        motivation: d.motivation,

        height: d.height,
        currentWeight: d.currentWeight,
        targetWeight: d.targetWeight,
        medicalConditions: d.medicalConditions,
        medicationsSupplements: d.medicationsSupplements,
        allergies: d.allergies,
        pregnantOrBreastfeeding: d.pregnantOrBreastfeeding,

        activityLevel: d.activityLevel,
        exerciseDays: d.exerciseDays,
        sleepHours: d.sleepHours,
        stressLevel: d.stressLevel,

        mealsPerDay: d.mealsPerDay,
        breakfastFrequency: d.breakfastFrequency,
        eatOutFrequency: d.eatOutFrequency,
        snackFrequency: d.snackFrequency,
        waterIntake: d.waterIntake,

        foodsLoved: d.foodsLoved,
        foodsDisliked: d.foodsDisliked,
        foodsNeverEaten: d.foodsNeverEaten,
        preferredProteins: d.preferredProteins,
        preferredCarbs: d.preferredCarbs,
        favouriteVeggies: d.favouriteVeggies,
        favouriteFruits: d.favouriteFruits,
        spiceLevel: d.spiceLevel,

        interestedPlan: d.interestedPlan || null,
        planSlug: d.interestedPlan || null,
        mealsNeeded: d.mealsNeeded,
        deliveryDays: d.deliveryDays,
        preferredTime: d.preferredTime,

        deliveryAddress: d.deliveryAddress,
        deliveryInstructions: d.deliveryInstructions,
        contactMethod: d.contactMethod,

        consentAccurate: d.consentAccurate,
        consentAdvice: d.consentAdvice,
        consentContact: d.consentContact,
      },
    });

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "hello@norishe.vip";
    await Promise.all([
      sendEmail({
        to: adminEmail,
        subject: `New enrollment — ${d.fullName}`,
        html: adminNotificationEmail("New Enrollment", {
          Name: d.fullName,
          Email: d.email,
          Phone: d.phone,
          Plan: d.interestedPlan || "Not specified",
          City: `${d.city}, ${d.state}`,
        }),
      }),
      sendEmail({
        to: d.email,
        subject: "Welcome to the Norishé Family!",
        html: welcomeEmail(d.fullName.split(" ")[0]),
      }),
    ]);

    return NextResponse.json({ ok: true, id: enrollment.id }, { status: 201 });
  } catch (err) {
    console.error("[api/enroll] error", err);
    return NextResponse.json(
      { error: "We couldn't submit your enrollment right now. Please try again shortly, or reach us on WhatsApp." },
      { status: 503 }
    );
  }
}
