"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { MenuIcon } from "@/components/ui/icons";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?sort=newest", label: "New Arrivals" },
  { href: "/#editorial", label: "Editorial" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AnnouncementBar />

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors duration-500 ease-editorial",
          scrolled ? "border-stone bg-bone/85 backdrop-blur-md" : "border-transparent bg-bone",
        )}
      >
        <Container width="wide" className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 lg:h-20 lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-ml-2 p-2 text-ink transition-opacity duration-200 hover:opacity-60 lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="underline-sweep text-[11px] tracking-[0.18em] uppercase"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href="/"
            aria-label="AUREL & ASH — home"
            className="justify-self-center text-[13px] font-semibold tracking-[0.24em] lg:text-[16px] lg:tracking-[0.3em]"
          >
            AUREL <span className="text-brass-ink">&amp;</span> ASH
          </Link>

          <Link
            href="/shop"
            className="underline-sweep justify-self-end text-[11px] tracking-[0.18em] uppercase lg:text-[12px] lg:tracking-[0.2em]"
          >
            <span className="hidden lg:inline">Shop the Collection</span>
            <span className="lg:hidden">Shop</span>
          </Link>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}