"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LeafMark } from "@/components/icons/Leaf";

export function LeadMagnet({ headline, body }: { headline: string; body: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "NEWSLETTER", email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-cream py-20">
      <Container className="flex flex-col items-center">
        <Reveal className="w-full max-w-xl rounded-xl2 bg-ivory p-9 text-center shadow-soft">
          <LeafMark className="mx-auto h-8 w-14 text-gold" />
          <h2 className="mt-4 font-serif text-2xl text-forest sm:text-3xl">
            {headline}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-charcoal/65">
            {body}
          </p>
          {status === "done" ? (
            <p className="mt-6 font-medium text-forest">Thank you — check your inbox for your guide!</p>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-full border border-forest/15 bg-white px-5 py-3 text-sm focus:border-gold focus:outline-none"
              />
              <button type="submit" className="btn-gold whitespace-nowrap" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send My Guide"}
              </button>
            </form>
          )}
          {status === "error" && <p className="mt-3 text-xs text-red-500">Something went wrong — please try again.</p>}
        </Reveal>
      </Container>
    </section>
  );
}
