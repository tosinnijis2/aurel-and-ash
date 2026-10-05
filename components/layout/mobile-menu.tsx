"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CloseIcon } from "@/components/ui/icons";
import { NAV_LINKS } from "@/components/layout/site-header";

/**
 * Full-screen navigation for small viewports.
 *
 * Mounts only while open, locks background scroll, closes on Escape and on
 * navigation, and returns focus to whatever opened it.
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    opener.current = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-60 flex flex-col bg-bone lg:hidden"
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-stone px-5">
        <p className="text-[14px] font-semibold tracking-[0.24em]">
          AUREL <span className="text-brass-ink">&amp;</span> ASH
        </p>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="-mr-2 p-2 text-ink transition-opacity duration-200 hover:opacity-60"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <Container className="flex flex-1 flex-col justify-center">
        <nav aria-label="Mobile">
          <ul>
            {NAV_LINKS.map((item, index) => (
              <li key={item.href} className="menu-item border-b border-stone" style={{ animationDelay: `${60 + index * 55}ms` }}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block py-5 text-[26px] leading-none font-medium tracking-[-0.02em] text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="shrink-0 border-t border-stone px-5 py-6">
        <p className="text-[11px] tracking-[0.2em] text-ash uppercase">Designed for the everyday</p>
      </div>
    </div>
  );
}