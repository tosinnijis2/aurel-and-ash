import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "ink" | "brass" | "quiet";

const TONES: Record<Tone, string> = {
  ink: "bg-ink text-bone",
  brass: "bg-brass text-bone",
  quiet: "bg-bone/85 text-ink-soft border border-stone",
};

export function Badge({
  tone = "ink",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center px-2.5 text-[10px] font-medium tracking-[0.16em] uppercase",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}