"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(5, "Tell us a little more"),
});
type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "CONTACT", ...data }),
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
        <p className="mt-4 font-serif text-xl text-forest">Message sent.</p>
        <p className="mt-2 text-sm text-charcoal/65">We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-ivory space-y-5 p-8">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-forest/70">Full Name</span>
        <input {...register("name")} className="input" placeholder="Your name" />
        {errors.name && <span className="mt-1 block text-xs text-red-500">{errors.name.message}</span>}
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-forest/70">Email</span>
        <input {...register("email")} type="email" className="input" placeholder="you@email.com" />
        {errors.email && <span className="mt-1 block text-xs text-red-500">{errors.email.message}</span>}
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-forest/70">Phone (optional)</span>
        <input {...register("phone")} className="input" placeholder="0801 234 5678" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-forest/70">Message</span>
        <textarea {...register("message")} rows={5} className="input" placeholder="How can we help?" />
        {errors.message && <span className="mt-1 block text-xs text-red-500">{errors.message.message}</span>}
      </label>
      <button type="submit" className="btn-gold w-full" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {status === "error" && <p className="text-sm text-red-500">Something went wrong — please try again.</p>}
    </form>
  );
}
