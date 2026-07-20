"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/components/Analytics";

export function MobileBottomBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-forest/10 bg-ivory/95 backdrop-blur md:hidden">
      <Link
        href="/plans"
        onClick={() => trackEvent("cta_click", pathname || "/", "mobile-bar-view-plans")}
        className="flex-1 border-r border-forest/10 py-3.5 text-center text-sm font-semibold text-forest"
      >
        View Plans
      </Link>
      <Link
        href="/enroll"
        onClick={() => trackEvent("cta_click", pathname || "/", "mobile-bar-enroll")}
        className="flex-1 bg-gold-gradient py-3.5 text-center text-sm font-semibold text-forest-dark"
      >
        Enroll Now
      </Link>
    </div>
  );
}
