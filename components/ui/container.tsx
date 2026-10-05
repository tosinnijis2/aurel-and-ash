import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const WIDTHS = {
  default: "max-w-[1440px]",
  wide: "max-w-[1680px]",
  narrow: "max-w-[760px]",
} as const;

export type ContainerWidth = keyof typeof WIDTHS;

export function Container({
  width = "default",
  className,
  children,
}: {
  width?: ContainerWidth;
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", WIDTHS[width], className)}>{children}</div>;
}