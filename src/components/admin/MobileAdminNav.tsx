"use client";
import { useRouter, usePathname } from "next/navigation";

const ROUTES = [
  ["/admin", "Dashboard"],
  ["/admin/enrollments", "Enrollments"],
  ["/admin/leads", "Leads"],
  ["/admin/plans", "Plans & Pricing"],
  ["/admin/menu", "Menu Manager"],
  ["/admin/testimonials", "Testimonials"],
  ["/admin/faq", "FAQ"],
  ["/admin/content", "Site Content"],
  ["/admin/delivery", "Delivery Schedule"],
  ["/admin/analytics", "Analytics"],
  ["/admin/settings", "Settings"],
];

export function MobileAdminNav() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <select
      value={pathname || "/admin"}
      onChange={(e) => router.push(e.target.value)}
      className="input lg:hidden"
    >
      {ROUTES.map(([href, label]) => (
        <option key={href} value={href}>{label}</option>
      ))}
    </select>
  );
}
