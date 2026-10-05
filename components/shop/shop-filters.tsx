"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { SearchIcon } from "@/components/ui/icons";
import { CATEGORY_LABELS, PRODUCT_CATEGORIES, SORT_LABELS, SORT_OPTIONS } from "@/lib/products";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;

/**
 * Filtering state lives entirely in the URL, so a filtered view is shareable,
 * survives a refresh and renders on the server with no client state to hydrate.
 */
export function ShopFilters({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const category = params.get("category") ?? "ALL";
  const sort = params.get("sort") ?? "featured";
  const activeQuery = params.get("q") ?? "";

  const [term, setTerm] = useState(activeQuery);
  const firstRender = useRef(true);

  const commit = useCallback(
    (changes: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (!value || value === "ALL" || (key === "sort" && value === "featured")) next.delete(key);
        else next.set(key, value);
      }
      const query = next.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [params, pathname, router],
  );

  // Typing updates the URL on a debounce instead of on every keystroke.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (term === activeQuery) return;

    const timer = setTimeout(() => commit({ q: term }), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [term, activeQuery, commit]);

  return (
    <div className="border-b border-stone pb-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Filter by category</legend>
          {["ALL", ...PRODUCT_CATEGORIES].map((value) => {
            const active = category === value;
            const label = value === "ALL" ? "All" : CATEGORY_LABELS[value as keyof typeof CATEGORY_LABELS];
            return (
              <button
                key={value}
                type="button"
                onClick={() => commit({ category: value })}
                aria-pressed={active}
                className={cn(
                  "h-9 border px-4 text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 ease-editorial",
                  active
                    ? "border-ink bg-ink text-bone"
                    : "border-stone text-ink hover:border-ink",
                )}
              >
                {label}
              </button>
            );
          })}
        </fieldset>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <label htmlFor="shop-search" className="sr-only">
              Search products
            </label>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ash" />
            <input
              id="shop-search"
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search the collection"
              className="h-9 w-full border border-stone bg-transparent pr-3 pl-9 text-[13px] placeholder:text-ash focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="shop-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="shop-sort"
              value={sort}
              onChange={(event) => commit({ sort: event.target.value })}
              className="h-9 w-full border border-stone bg-transparent px-3 text-[12px] tracking-[0.12em] text-ink uppercase focus:border-ink focus:outline-none sm:w-auto"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {SORT_LABELS[option]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-[12px] tracking-[0.14em] text-ash uppercase">
        {pending ? "Updating" : `${total} ${total === 1 ? "product" : "products"}`}
      </p>
    </div>
  );
}