"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CtaLink } from "@/components/ui/CtaLink";
import { cx } from "@/lib/utils";

const NAV = [
  { href: "/about", label: "Our Story" },
  { href: "/plans", label: "Meal Plans" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/menu", label: "Menu" },
  { href: "/corporate", label: "Corporate" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !isHome || open;

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid ? "bg-forest/97 backdrop-blur shadow-soft" : "bg-transparent"
      )}
    >
      <div className="container-nrs flex h-20 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "text-sm font-medium tracking-wide text-cream/90 transition-colors hover:text-gold",
                pathname === item.href && "text-gold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block">
          <CtaLink href="/enroll" label="header-start-plan" className="!py-2.5 !px-6 !text-xs">
            Start Your Plan
          </CtaLink>
        </div>
        <button
          className="flex h-10 w-10 items-center justify-center text-cream lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-cream/10 bg-forest px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-cream/90 hover:bg-white/5 hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <CtaLink href="/enroll" label="mobile-menu-start-plan" className="mt-4 w-full">
            Start Your Plan
          </CtaLink>
        </div>
      )}
    </header>
  );
}
