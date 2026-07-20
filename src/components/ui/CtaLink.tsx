"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/components/Analytics";
import { cx } from "@/lib/utils";

export function CtaLink({
  href,
  children,
  variant = "gold",
  label,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "gold" | "outline" | "outline-dark";
  label?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const cls = variant === "gold" ? "btn-gold" : variant === "outline" ? "btn-outline" : "btn-outline-dark";
  return (
    <Link
      href={href}
      className={cx(cls, className)}
      onClick={() => trackEvent("cta_click", pathname || "/", label || href)}
    >
      {children}
    </Link>
  );
}
