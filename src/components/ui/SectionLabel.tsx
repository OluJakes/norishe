import { cx } from "@/lib/utils";

export function SectionLabel({ children, light = false, center = false }: { children: React.ReactNode; light?: boolean; center?: boolean }) {
  return (
    <div className={cx("flex items-center gap-3 mb-4", center && "justify-center")}>
      <span className="rule-gold" />
      <span className={cx("label-caps", light && "text-gold-light")}>{children}</span>
      {center && <span className="rule-gold" />}
    </div>
  );
}
