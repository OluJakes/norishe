"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { enrollSchema, STEP_SCHEMAS, REASON_OPTIONS, type EnrollFormData } from "@/lib/validation/enroll";
import { Field, ChipGroup, Slider, StepShell } from "@/components/enroll/fields";
import { cx } from "@/lib/utils";
import { PLANS } from "@/lib/plans-content";

const STORAGE_KEY = "norishe_enroll_draft_v1";
const TOTAL_STEPS = 9;

const STEP_TITLES = [
  "Personal Information",
  "Wellness Goals",
  "Health Profile",
  "Lifestyle",
  "Eating Habits",
  "Food Preferences",
  "Meal Plan Preferences",
  "Packaging & Delivery",
  "Review & Consent",
];

const DEFAULT_VALUES: Partial<EnrollFormData> = {
  reasons: [],
  motivation: 3,
  exerciseDays: 3,
  mealsPerDay: 3,
  mealsNeeded: 5,
  deliveryDays: 5,
  consentAccurate: undefined,
  consentAdvice: undefined,
  consentContact: undefined,
};

export function EnrollWizard() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || "";
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const methods = useForm<EnrollFormData>({
    resolver: zodResolver(enrollSchema),
    defaultValues: DEFAULT_VALUES as EnrollFormData,
    mode: "onChange",
  });

  const { handleSubmit, trigger, watch, reset, getValues } = methods;

  // Load autosaved draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        reset({ ...DEFAULT_VALUES, ...parsed, interestedPlan: parsed.interestedPlan || planParam || undefined });
      } else if (planParam) {
        reset({ ...DEFAULT_VALUES, interestedPlan: planParam } as EnrollFormData);
      }
    } catch {
      /* ignore corrupted draft */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave on change
  useEffect(() => {
    const sub = watch((values) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {
        /* storage unavailable */
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const stepFieldNames = useMemo(() => Object.keys(STEP_SCHEMAS[step].shape) as (keyof EnrollFormData)[], [step]);

  async function next() {
    const valid = await trigger(stepFieldNames as any);
    if (!valid) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(data: EnrollFormData) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      localStorage.removeItem(STORAGE_KEY);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("We couldn't submit your enrollment right now. Please try again, or reach us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-xl2 bg-ivory p-10 text-center shadow-soft">
        <CheckCircle2 className="mx-auto h-14 w-14 text-gold" strokeWidth={1.3} />
        <h1 className="mt-6 font-serif text-3xl text-forest">Welcome to the Norishé Family!</h1>
        <p className="mt-4 leading-relaxed text-charcoal/70">
          Our team will review your information and contact you within 24–48 hours with your personalized
          recommendation and next steps.
        </p>
        <p className="mt-6 font-serif italic text-gold-dark">
          "Prepared with care, balance, and intention — just for you."
        </p>
        <a href="/" className="btn-gold mt-8 inline-flex">Back to Home</a>
      </div>
    );
  }

  const progress = Math.round(((step + 1) / TOTAL_STEPS) * 100);

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-forest/60">
          <span>Step {step + 1} of {TOTAL_STEPS}</span>
          <span>{STEP_TITLES[step]}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-forest/10">
          <div className="h-full rounded-full bg-gold-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 rounded-xl2 bg-ivory p-7 shadow-soft sm:p-10">
          {step === 0 && <StepPersonal />}
          {step === 1 && <StepGoals />}
          {step === 2 && <StepHealth />}
          {step === 3 && <StepLifestyle />}
          {step === 4 && <StepEating />}
          {step === 5 && <StepPreferences />}
          {step === 6 && <StepPlan />}
          {step === 7 && <StepDelivery />}
          {step === 8 && <StepReview goToStep={setStep} />}

          {submitError && <p className="mt-6 text-sm text-red-500">{submitError}</p>}

          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="btn-outline-dark disabled:opacity-0"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < TOTAL_STEPS - 1 ? (
              <button type="button" onClick={next} className="btn-gold">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="btn-gold">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {submitting ? "Submitting..." : "Submit Enrollment"}
              </button>
            )}
          </div>
        </form>
        <p className="mt-4 text-center text-xs text-charcoal/40">
          Your progress is saved automatically on this device — feel free to come back and finish later.
        </p>
      </div>
    </FormProvider>
  );
}

function StepPersonal() {
  const { register, formState: { errors } } = useFormContext<EnrollFormData>();
  return (
    <StepShell title="Personal Information" subtitle="Let's start with the basics.">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full Name" error={errors.fullName?.message}>
          <input {...register("fullName")} className="input" placeholder="Jane Doe" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className="input" placeholder="jane@email.com" />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input {...register("phone")} className="input" placeholder="0801 234 5678" />
        </Field>
        <Field label="Date of Birth" error={errors.dateOfBirth?.message}>
          <input {...register("dateOfBirth")} type="date" className="input" />
        </Field>
        <Field label="Gender" error={errors.gender?.message}>
          <select {...register("gender")} className="input">
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Prefer not to say</option>
          </select>
        </Field>
        <Field label="Occupation" error={errors.occupation?.message}>
          <input {...register("occupation")} className="input" placeholder="e.g. Marketing Manager" />
        </Field>
        <Field label="City" error={errors.city?.message}>
          <input {...register("city")} className="input" placeholder="Abuja" />
        </Field>
        <Field label="State" error={errors.state?.message}>
          <input {...register("state")} className="input" placeholder="FCT" />
        </Field>
      </div>
      <Field label="Emergency Contact (optional)">
        <input {...register("emergencyContact")} className="input" placeholder="Name & phone number" />
      </Field>
    </StepShell>
  );
}

function StepGoals() {
  const { setValue, watch, formState: { errors } } = useFormContext<EnrollFormData>();
  const reasons = watch("reasons") || [];
  const motivation = watch("motivation") ?? 3;
  return (
    <StepShell title="Wellness Goals" subtitle="What brings you to Norishé?">
      <Field label="Reason for Joining (select all that apply)" error={errors.reasons?.message as string}>
        <ChipGroup options={REASON_OPTIONS} value={reasons} onChange={(v) => setValue("reasons", v, { shouldValidate: true })} />
      </Field>
      <Field label="Top 3 Goals for the Next 3 Months" error={errors.topGoals?.message}>
        <textarea {...useFormContext<EnrollFormData>().register("topGoals")} rows={3} className="input" placeholder="e.g. Lose 5kg, cook less, feel more energized" />
      </Field>
      <Field label="Motivation Level">
        <Slider value={motivation} onChange={(v) => setValue("motivation", v)} min={1} max={5} labels={["Just exploring", "Fully committed"]} />
      </Field>
    </StepShell>
  );
}

function StepHealth() {
  const { register, formState: { errors } } = useFormContext<EnrollFormData>();
  return (
    <StepShell title="Health Profile" subtitle="This helps us build a safe, personalized plan.">
      <p className="rounded-lg bg-cream px-4 py-3 text-xs leading-relaxed text-charcoal/60">
        Your health information is kept private, encrypted where practical, and visible only to authorized Norishé staff. See our Privacy Policy for details.
      </p>
      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="Height" error={errors.height?.message}>
          <input {...register("height")} className="input" placeholder="e.g. 170cm" />
        </Field>
        <Field label="Current Weight" error={errors.currentWeight?.message}>
          <input {...register("currentWeight")} className="input" placeholder="e.g. 75kg" />
        </Field>
        <Field label="Target Weight" error={errors.targetWeight?.message}>
          <input {...register("targetWeight")} className="input" placeholder="e.g. 68kg" />
        </Field>
      </div>
      <Field label="Medical Conditions (optional)">
        <textarea {...register("medicalConditions")} rows={2} className="input" placeholder="e.g. Hypertension, diabetes" />
      </Field>
      <Field label="Medications / Supplements (optional)">
        <textarea {...register("medicationsSupplements")} rows={2} className="input" />
      </Field>
      <Field label="Food Allergies / Intolerances (optional)">
        <textarea {...register("allergies")} rows={2} className="input" placeholder="e.g. Shellfish, peanuts, lactose" />
      </Field>
      <Field label="Pregnant or Breastfeeding? (optional)">
        <select {...register("pregnantOrBreastfeeding")} className="input">
          <option value="">Select</option>
          <option>Not applicable</option>
          <option>Pregnant</option>
          <option>Breastfeeding</option>
        </select>
      </Field>
    </StepShell>
  );
}

function StepLifestyle() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<EnrollFormData>();
  const exerciseDays = watch("exerciseDays") ?? 3;
  return (
    <StepShell title="Lifestyle" subtitle="Tell us how you move through your week.">
      <Field label="Activity Level" error={errors.activityLevel?.message}>
        <select {...register("activityLevel")} className="input">
          <option value="">Select</option>
          <option>Sedentary</option>
          <option>Lightly Active</option>
          <option>Moderately Active</option>
          <option>Very Active</option>
        </select>
      </Field>
      <Field label="Exercise Days per Week">
        <Slider value={exerciseDays} onChange={(v) => setValue("exerciseDays", v)} min={0} max={7} labels={["0", "7"]} />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Sleep Hours (avg/night)" error={errors.sleepHours?.message}>
          <select {...register("sleepHours")} className="input">
            <option value="">Select</option>
            <option>Less than 5</option>
            <option>5–6</option>
            <option>7–8</option>
            <option>9+</option>
          </select>
        </Field>
        <Field label="Stress Level" error={errors.stressLevel?.message}>
          <select {...register("stressLevel")} className="input">
            <option value="">Select</option>
            <option>Low</option>
            <option>Moderate</option>
            <option>High</option>
            <option>Very High</option>
          </select>
        </Field>
      </div>
    </StepShell>
  );
}

function StepEating() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<EnrollFormData>();
  const mealsPerDay = watch("mealsPerDay") ?? 3;
  return (
    <StepShell title="Eating Habits" subtitle="Help us understand your current routine.">
      <Field label="Meals per Day">
        <Slider value={mealsPerDay} onChange={(v) => setValue("mealsPerDay", v)} min={1} max={6} labels={["1", "6"]} />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Breakfast Frequency" error={errors.breakfastFrequency?.message}>
          <select {...register("breakfastFrequency")} className="input">
            <option value="">Select</option>
            <option>Daily</option>
            <option>Most days</option>
            <option>Rarely</option>
            <option>Never</option>
          </select>
        </Field>
        <Field label="Eat-Out Frequency" error={errors.eatOutFrequency?.message}>
          <select {...register("eatOutFrequency")} className="input">
            <option value="">Select</option>
            <option>Daily</option>
            <option>Few times a week</option>
            <option>Weekly</option>
            <option>Rarely</option>
          </select>
        </Field>
        <Field label="Snack Frequency" error={errors.snackFrequency?.message}>
          <select {...register("snackFrequency")} className="input">
            <option value="">Select</option>
            <option>Multiple times daily</option>
            <option>Once daily</option>
            <option>Few times a week</option>
            <option>Rarely</option>
          </select>
        </Field>
        <Field label="Daily Water Intake" error={errors.waterIntake?.message}>
          <select {...register("waterIntake")} className="input">
            <option value="">Select</option>
            <option>Less than 1L</option>
            <option>1–2L</option>
            <option>2–3L</option>
            <option>3L+</option>
          </select>
        </Field>
      </div>
    </StepShell>
  );
}

function StepPreferences() {
  const { register, formState: { errors } } = useFormContext<EnrollFormData>();
  return (
    <StepShell title="Food Preferences" subtitle="So we can build meals you'll actually love.">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Foods You Love (optional)">
          <textarea {...register("foodsLoved")} rows={2} className="input" />
        </Field>
        <Field label="Foods You Dislike (optional)">
          <textarea {...register("foodsDisliked")} rows={2} className="input" />
        </Field>
        <Field label="Foods You Never Eat (optional)">
          <textarea {...register("foodsNeverEaten")} rows={2} className="input" />
        </Field>
        <Field label="Preferred Proteins (optional)">
          <input {...register("preferredProteins")} className="input" placeholder="e.g. Chicken, fish, beef" />
        </Field>
        <Field label="Preferred Carbohydrates (optional)">
          <input {...register("preferredCarbs")} className="input" placeholder="e.g. Rice, quinoa, sweet potato" />
        </Field>
        <Field label="Favourite Vegetables (optional)">
          <input {...register("favouriteVeggies")} className="input" />
        </Field>
        <Field label="Favourite Fruits (optional)">
          <input {...register("favouriteFruits")} className="input" />
        </Field>
        <Field label="Spice Level" error={errors.spiceLevel?.message}>
          <select {...register("spiceLevel")} className="input">
            <option value="">Select</option>
            <option>Mild</option>
            <option>Medium</option>
            <option>Hot</option>
            <option>Extra Hot</option>
          </select>
        </Field>
      </div>
    </StepShell>
  );
}

function StepPlan() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<EnrollFormData>();
  const mealsNeeded = watch("mealsNeeded") ?? 5;
  const deliveryDays = watch("deliveryDays") ?? 5;
  return (
    <StepShell title="Meal Plan Preferences" subtitle="Almost there — let's talk logistics.">
      <Field label="Interested Plan" error={errors.interestedPlan?.message}>
        <select {...register("interestedPlan")} className="input">
          <option value="">Not sure yet — recommend one for me</option>
          {PLANS.map((p) => (
            <option key={p.slug} value={p.slug}>{p.emoji} {p.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Meals Needed per Week">
        <Slider value={mealsNeeded} onChange={(v) => setValue("mealsNeeded", v)} min={5} max={20} labels={["5", "20"]} />
      </Field>
      <Field label="Delivery Days per Week">
        <Slider value={deliveryDays} onChange={(v) => setValue("deliveryDays", v)} min={1} max={7} labels={["1", "7"]} />
      </Field>
      <Field label="Preferred Delivery Time" error={errors.preferredTime?.message}>
        <select {...register("preferredTime")} className="input">
          <option value="">Select</option>
          <option>Morning (7am–10am)</option>
          <option>Midday (11am–2pm)</option>
          <option>Afternoon (2pm–5pm)</option>
          <option>Evening (5pm–8pm)</option>
        </select>
      </Field>
    </StepShell>
  );
}

function StepDelivery() {
  const { register, formState: { errors } } = useFormContext<EnrollFormData>();
  return (
    <StepShell title="Packaging & Delivery" subtitle="Where should we bring your meals?">
      <Field label="Delivery Address" error={errors.deliveryAddress?.message}>
        <textarea {...register("deliveryAddress")} rows={3} className="input" placeholder="Full delivery address" />
      </Field>
      <Field label="Delivery Instructions (optional)">
        <textarea {...register("deliveryInstructions")} rows={2} className="input" placeholder="Gate code, landmark, preferred entrance..." />
      </Field>
      <Field label="Preferred Contact Method" error={errors.contactMethod?.message}>
        <select {...register("contactMethod")} className="input">
          <option value="">Select</option>
          <option>Phone Call</option>
          <option>WhatsApp</option>
          <option>Email</option>
          <option>SMS</option>
        </select>
      </Field>
    </StepShell>
  );
}

function StepReview({ goToStep }: { goToStep: (n: number) => void }) {
  const { register, watch, formState: { errors } } = useFormContext<EnrollFormData>();
  const values = watch();
  const plan = PLANS.find((p) => p.slug === values.interestedPlan);

  const rows: [string, string | number | undefined, number][] = [
    ["Full Name", values.fullName, 0],
    ["Email", values.email, 0],
    ["Phone", values.phone, 0],
    ["City / State", `${values.city || ""}, ${values.state || ""}`, 0],
    ["Reasons for Joining", (values.reasons || []).join(", "), 1],
    ["Top Goals", values.topGoals, 1],
    ["Height / Weight", `${values.height || ""} · ${values.currentWeight || ""} → ${values.targetWeight || ""}`, 2],
    ["Activity Level", values.activityLevel, 3],
    ["Meals per Day", values.mealsPerDay, 4],
    ["Spice Level", values.spiceLevel, 5],
    ["Interested Plan", plan ? `${plan.emoji} ${plan.name}` : "Not specified", 6],
    ["Meals Needed / Delivery Days", `${values.mealsNeeded || ""} meals · ${values.deliveryDays || ""} delivery days`, 6],
    ["Delivery Address", values.deliveryAddress, 7],
  ];

  return (
    <StepShell title="Review & Consent" subtitle="Please confirm your details before submitting.">
      <div className="divide-y divide-forest/10 rounded-xl border border-forest/10">
        {rows.map(([label, value, stepIdx]) => (
          <div key={label} className="flex items-start justify-between gap-4 px-5 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-forest/50">{label}</p>
              <p className="mt-0.5 text-sm text-charcoal/80">{value || "—"}</p>
            </div>
            <button type="button" onClick={() => goToStep(stepIdx)} className="flex-shrink-0 text-xs font-semibold text-gold-dark hover:underline">
              Edit
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-4 rounded-xl bg-cream p-5">
        <ConsentCheckbox
          name="consentAccurate"
          register={register}
          error={errors.consentAccurate?.message as string}
          label="I confirm the information provided is accurate to the best of my knowledge."
        />
        <ConsentCheckbox
          name="consentAdvice"
          register={register}
          error={errors.consentAdvice?.message as string}
          label="I understand Norishé provides personalized meal recommendations, not medical advice."
        />
        <ConsentCheckbox
          name="consentContact"
          register={register}
          error={errors.consentContact?.message as string}
          label="I consent to being contacted about my meal plan, deliveries, promotions, and wellness updates."
        />
      </div>
    </StepShell>
  );
}

function ConsentCheckbox({ name, register, error, label }: { name: any; register: any; error?: string; label: string }) {
  return (
    <label className="flex items-start gap-3">
      <input type="checkbox" {...register(name)} className="mt-1 h-5 w-5 flex-shrink-0 accent-[#1E3A2A]" />
      <span className="text-sm text-charcoal/75">
        {label}
        {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
      </span>
    </label>
  );
}
