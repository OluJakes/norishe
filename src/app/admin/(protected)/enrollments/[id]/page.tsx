import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EnrollmentStatusSelect, EnrollmentNotes } from "@/components/admin/EnrollmentActions";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-forest/5 py-2.5 sm:flex-row sm:items-baseline sm:gap-4">
      <span className="w-56 flex-shrink-0 text-xs font-semibold uppercase tracking-wide text-forest/50">{label}</span>
      <span className="text-sm text-charcoal/80">{value || value === 0 ? String(value) : "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-ivory p-6">
      <h3 className="font-serif text-lg text-forest">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default async function EnrollmentDetailPage({ params }: { params: { id: string } }) {
  let e: any = null;
  try {
    e = await prisma.enrollment.findUnique({ where: { id: params.id } });
  } catch {
    /* db unavailable */
  }
  if (!e) notFound();

  const reasons: string[] = (() => {
    try { return JSON.parse(e.reasons); } catch { return []; }
  })();

  return (
    <div>
      <Link href="/admin/enrollments" className="inline-flex items-center gap-1.5 text-sm text-forest/60 hover:text-forest">
        <ArrowLeft className="h-4 w-4" /> Back to Enrollments
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl text-forest">{e.fullName}</h1>
          <p className="mt-1 text-sm text-charcoal/60">Submitted {new Date(e.createdAt).toLocaleString()}</p>
        </div>
        <div className="w-full sm:w-52">
          <EnrollmentStatusSelect id={e.id} status={e.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="1. Personal Information">
            <Row label="Full Name" value={e.fullName} />
            <Row label="Email" value={e.email} />
            <Row label="Phone" value={e.phone} />
            <Row label="Date of Birth" value={e.dateOfBirth} />
            <Row label="Gender" value={e.gender} />
            <Row label="Occupation" value={e.occupation} />
            <Row label="City / State" value={`${e.city}, ${e.state}`} />
            <Row label="Emergency Contact" value={e.emergencyContact} />
          </Section>

          <Section title="2. Wellness Goals">
            <Row label="Reasons for Joining" value={reasons.join(", ")} />
            <Row label="Top 3-Month Goals" value={e.topGoals} />
            <Row label="Motivation (1–5)" value={e.motivation} />
          </Section>

          <Section title="3. Health Profile">
            <Row label="Height" value={e.height} />
            <Row label="Current Weight" value={e.currentWeight} />
            <Row label="Target Weight" value={e.targetWeight} />
            <Row label="Medical Conditions" value={e.medicalConditions} />
            <Row label="Medications / Supplements" value={e.medicationsSupplements} />
            <Row label="Allergies" value={e.allergies} />
            <Row label="Pregnant / Breastfeeding" value={e.pregnantOrBreastfeeding} />
          </Section>

          <Section title="4. Lifestyle">
            <Row label="Activity Level" value={e.activityLevel} />
            <Row label="Exercise Days / Week" value={e.exerciseDays} />
            <Row label="Sleep Hours" value={e.sleepHours} />
            <Row label="Stress Level" value={e.stressLevel} />
          </Section>

          <Section title="5. Eating Habits">
            <Row label="Meals / Day" value={e.mealsPerDay} />
            <Row label="Breakfast Frequency" value={e.breakfastFrequency} />
            <Row label="Eat-Out Frequency" value={e.eatOutFrequency} />
            <Row label="Snack Frequency" value={e.snackFrequency} />
            <Row label="Water Intake" value={e.waterIntake} />
          </Section>

          <Section title="6. Food Preferences">
            <Row label="Foods Loved" value={e.foodsLoved} />
            <Row label="Foods Disliked" value={e.foodsDisliked} />
            <Row label="Foods Never Eaten" value={e.foodsNeverEaten} />
            <Row label="Preferred Proteins" value={e.preferredProteins} />
            <Row label="Preferred Carbs" value={e.preferredCarbs} />
            <Row label="Favourite Vegetables" value={e.favouriteVeggies} />
            <Row label="Favourite Fruits" value={e.favouriteFruits} />
            <Row label="Spice Level" value={e.spiceLevel} />
          </Section>

          <Section title="7. Meal Plan Preferences">
            <Row label="Interested Plan" value={e.interestedPlan} />
            <Row label="Meals Needed / Week" value={e.mealsNeeded} />
            <Row label="Delivery Days / Week" value={e.deliveryDays} />
            <Row label="Preferred Time" value={e.preferredTime} />
          </Section>

          <Section title="8. Packaging & Delivery">
            <Row label="Delivery Address" value={e.deliveryAddress} />
            <Row label="Delivery Instructions" value={e.deliveryInstructions} />
            <Row label="Preferred Contact Method" value={e.contactMethod} />
          </Section>

          <Section title="9. Consent">
            <Row label="Confirmed Accurate Info" value={e.consentAccurate ? "Yes" : "No"} />
            <Row label="Understands Recommendations" value={e.consentAdvice ? "Yes" : "No"} />
            <Row label="Consents to Contact" value={e.consentContact ? "Yes" : "No"} />
          </Section>
        </div>

        <div className="space-y-6">
          <div className="card-ivory p-6">
            <h3 className="font-serif text-lg text-forest">Internal Notes</h3>
            <p className="mt-1 text-xs text-charcoal/50">Visible only to Norishé staff.</p>
            <div className="mt-3">
              <EnrollmentNotes id={e.id} initialNotes={e.notes || ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
