"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, ClipboardList, Users, UtensilsCrossed, MessageSquareQuote,
  Package, CalendarDays, Settings, BarChart3, LogOut, FileText, HelpCircle,
} from "lucide-react";
import { cx } from "@/lib/utils";
import { LeafMark } from "@/components/icons/Leaf";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/enrollments", label: "Enrollments", icon: ClipboardList },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/plans", label: "Plans & Pricing", icon: Package },
  { href: "/admin/menu", label: "Menu Manager", icon: UtensilsCrossed },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/content", label: "Site Content", icon: FileText },
  { href: "/admin/delivery", label: "Delivery Schedule", icon: CalendarDays },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-forest-gradient text-cream lg:flex">
      <div className="flex h-20 items-center gap-2 px-6">
        <LeafMark className="h-6 w-10 text-gold" />
        <span className="font-serif text-xl text-ivory">Norish<span className="text-gold">é</span></span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                active ? "bg-gold-gradient text-forest-dark" : "text-cream/75 hover:bg-white/5 hover:text-gold"
              )}
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-cream/70 hover:bg-white/5 hover:text-gold"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
