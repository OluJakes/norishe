"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function trackEvent(type: "pageview" | "cta_click", path: string, label?: string) {
  try {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, path, label }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    trackEvent("pageview", pathname || "/");
  }, [pathname]);
  return null;
}
