"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  company: z.string().min(2, "Please enter your company name"),
  headcount: z.string().min(1, "Please provide an estimated headcount"),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function CorporateForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CORPORATE",
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          message: data.message,
          meta: JSON.stringify({ headcount: data.headcount }),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card-ivory p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
        <p className="mt-4 font-serif text-xl text-forest">Thank you for reaching out.</p>
        <p className="mt-2 text-sm text-charcoal/65">Our corporate wellness team will contact you within 1–2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-ivory space-y-5 p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name?.message}>
          <input {...register("name")} className="input" placeholder="Jane Doe" />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <input {...register("company")} className="input" placeholder="Acme Nigeria Ltd." />
        </Field>
        <Field label="Work Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className="input" placeholder="jane@company.com" />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input {...register("phone")} className="input" placeholder="0801 234 5678" />
        </Field>
        <Field label="Estimated Headcount" error={errors.headcount?.message}>
          <input {...register("headcount")} className="input" placeholder="e.g. 50–100 employees" />
        </Field>
      </div>
      <Field label="Message (optional)">
        <textarea {...register("message")} rows={4} className="input" placeholder="Tell us about your team's needs..." />
      </Field>
      <button type="submit" className="btn-gold w-full" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Request Corporate Proposal"}
      </button>
      {status === "error" && <p className="text-sm text-red-500">Something went wrong — please try again.</p>}
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-forest/70">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
