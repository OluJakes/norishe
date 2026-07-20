import { cx } from "@/lib/utils";

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("container-nrs", className)}>{children}</div>;
}
