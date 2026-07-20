"use client";
import Link from "next/link";
import { useState } from "react";
import { Instagram, Phone, Mail, ArrowRight, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";

const LINKS = [
  { href: "/about", label: "Our Story" },
  { href: "/plans", label: "Meal Plans" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/corporate", label: "Corporate Wellness" },
  { href: "/menu", label: "Menu & Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const LEGAL = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Service" },
];

type Settings = {
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  address: string;
};

export function Footer({
  settings,
  tagline,
  credit,
}: {
  settings: Settings;
  tagline: string;
  credit: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "NEWSLETTER", email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="bg-forest-gradient text-cream">
      <Container className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-4">
        <div>
          <Logo className="mb-4" />
          <p className="max-w-xs text-sm leading-relaxed text-cream/70">
            {tagline}
          </p>
          <p className="mt-6 font-serif text-lg text-gold">Nourish. Power. Thrive.</p>
          <a
            href={`https://instagram.com/${settings.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-cream/70 hover:text-gold"
          >
            <Instagram className="h-4 w-4" /> @{settings.instagram}
          </a>
        </div>

        <div>
          <p className="label-caps text-gold-light">Quick Links</p>
          <ul className="mt-4 space-y-2.5">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-cream/75 hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-caps text-gold-light">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-cream/75">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> {settings.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> {settings.email}</li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
              {settings.address}
            </li>
          </ul>
          <div className="mt-6 space-y-1 text-xs text-cream/50">
            {LEGAL.map((l) => (
              <div key={l.href}>
                <Link href={l.href} className="hover:text-gold">{l.label}</Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="label-caps text-gold-light">Stay Nourished</p>
          <p className="mt-4 text-sm text-cream/70">
            Get our free 7-Day Healthy Eating Guide and occasional wellness notes.
          </p>
          <form onSubmit={subscribe} className="mt-4 flex overflow-hidden rounded-full border border-cream/20 bg-white/5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full bg-transparent px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none"
            />
            <button type="submit" aria-label="Subscribe" className="flex items-center justify-center bg-gold-gradient px-4 text-forest-dark">
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          {status === "done" && <p className="mt-2 text-xs text-gold-light">You're on the list — check your inbox soon.</p>}
          {status === "error" && <p className="mt-2 text-xs text-red-300">Something went wrong. Please try again.</p>}
        </div>
      </Container>
      <div className="border-t border-cream/10 py-6">
        <Container className="flex flex-col items-center justify-center gap-1 text-center text-xs text-cream/50">
          <p>
            © {new Date().getFullYear()} Norishé. All rights reserved.
            {credit && <> {" "}|{" "} {credit}</>}
          </p>
        </Container>
      </div>
    </footer>
  );
}
