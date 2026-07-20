import Link from "next/link";
import { LeafMark } from "@/components/icons/Leaf";
import { cx } from "@/lib/utils";

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" className={cx("flex items-center gap-2 group", className)} aria-label="Norishé home">
      <LeafMark className={cx("h-7 w-11 transition-transform group-hover:scale-105", dark ? "text-forest" : "text-gold")} />
      <span
        className={cx(
          "font-serif text-2xl tracking-wide",
          dark ? "text-forest" : "text-ivory"
        )}
      >
        Norish<span className="text-gold">é</span>
      </span>
    </Link>
  );
}
