import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10",
        className,
      )}
    >
      <div>
        {eyebrow ? (
          <p className="text-[11px] tracking-[0.24em] text-ash uppercase">{eyebrow}</p>
        ) : null}
        <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,4.2vw,2.9rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance">
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}