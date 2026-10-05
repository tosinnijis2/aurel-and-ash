import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

/** Square corners and wide letter-spacing; the brand has no rounded language. */
const BASE =
  "inline-flex items-center justify-center gap-2.5 rounded-none font-medium whitespace-nowrap " +
  "transition-colors duration-300 ease-editorial select-none " +
  "disabled:pointer-events-none disabled:opacity-40";

const VARIANTS: Record<Variant, string> = {
  solid: "bg-ink text-bone hover:bg-ink-soft",
  outline: "border border-ink text-ink hover:bg-ink hover:text-bone",
  ghost: "text-ink hover:text-ink-soft",
  light: "border border-bone text-bone hover:bg-bone hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[11px] tracking-[0.14em]",
  md: "h-12 px-7 text-[12px] tracking-[0.14em]",
  lg: "h-14 px-9 text-[12px] tracking-[0.18em]",
};

function classes(variant: Variant, size: Size, className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ variant = "solid", size = "md", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={classes(variant, size, className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = "solid",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={classes(variant, size, className)}>
      {children}
    </Link>
  );
}

/** Inline editorial link with a wipe-in underline. */
export function TextLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn("underline-sweep font-medium text-ink", className)}>
      {children}
    </Link>
  );
}