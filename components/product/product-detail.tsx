"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { requiresSize, stockState, totalStock, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

const MAX_QUANTITY = 10;

function availabilityLine(product: Product): string {
  const state = stockState(product);
  if (state === "OUT_OF_STOCK") return "Currently unavailable";
  if (state === "LOW_STOCK") return `Only ${totalStock(product)} left in this run`;
  return "In stock — ships within 48 hours";
}

/**
 * Size and quantity selection.
 *
 * The add-to-bag control is rendered disabled on purpose: the cart is the next
 * phase of this build and there is no persistence behind it yet, so the button
 * states that plainly rather than pretending to accept an order.
 */
export function ProductDetail({ product }: { product: Product }) {
  const needsSize = requiresSize(product);
  const soldOut = stockState(product) === "OUT_OF_STOCK";

  const [size, setSize] = useState<string | null>(needsSize ? null : product.variants[0].label);
  const [quantity, setQuantity] = useState(1);

  const selected = product.variants.find((variant) => variant.label === size);
  const available = selected ? selected.quantity : totalStock(product);
  const sizeChosen = !needsSize || size !== null;
  const canOrder = !soldOut && sizeChosen && available > 0;

  return (
    <div>
      <h1 className="text-[clamp(1.85rem,4.5vw,2.75rem)] leading-[1.02] font-medium tracking-[-0.035em]">
        {product.name}
      </h1>
      <p className="mt-3 text-[14px] text-ash">{product.tagline}</p>
      <p className="mt-5 text-[20px] tabular-nums">{formatPrice(product.priceInCents)}</p>

      <div className="mt-8 border-y border-stone py-8">
        <h2 className="text-[13px] leading-relaxed text-ink-soft">{product.description}</h2>
      </div>

      {needsSize ? (
        <fieldset className="mt-8">
          <div className="flex items-baseline justify-between">
            <legend className="text-[11px] tracking-[0.2em] uppercase">Size</legend>
            {size ? <span className="text-[12px] text-ash">Selected: {size}</span> : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const unavailable = variant.quantity <= 0;
              const active = variant.label === size;
              return (
                <button
                  key={variant.label}
                  type="button"
                  disabled={unavailable || soldOut}
                  onClick={() => setSize(variant.label)}
                  aria-pressed={active}
                  className={cn(
                    "h-11 min-w-[3.5rem] border px-4 text-[13px] transition-colors duration-300 ease-editorial",
                    unavailable
                      ? "cursor-not-allowed border-stone text-ash/50 line-through"
                      : active
                        ? "border-ink bg-ink text-bone"
                        : "border-stone hover:border-ink",
                  )}
                >
                  {variant.label}
                </button>
              );
            })}
          </div>

          {!sizeChosen ? (
            <p role="status" className="mt-3 text-[12px] text-clay">
              Choose a size to continue.
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div className="mt-8">
        <span id="quantity-label" className="text-[11px] tracking-[0.2em] uppercase">
          Quantity
        </span>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex h-12 items-center border border-stone">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              disabled={soldOut || quantity <= 1}
              aria-label="Decrease quantity"
              className="h-full w-12 text-[17px] transition-opacity duration-200 hover:opacity-60 disabled:pointer-events-none disabled:opacity-30"
            >
              &minus;
            </button>
            <span
              aria-live="polite"
              aria-labelledby="quantity-label"
              className="w-10 text-center text-[15px] tabular-nums"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY, available, value + 1))}
              disabled={soldOut || quantity >= Math.min(MAX_QUANTITY, available)}
              aria-label="Increase quantity"
              className="h-full w-12 text-[17px] transition-opacity duration-200 hover:opacity-60 disabled:pointer-events-none disabled:opacity-30"
            >
              +
            </button>
          </div>

          <p className="text-[12px] text-ash">{availabilityLine(product)}</p>
        </div>
      </div>

      <div className="mt-10">
        <Button size="lg" disabled={!canOrder} className="w-full sm:w-auto">
          Add to Bag
        </Button>
        <p className="mt-3 text-[12px] leading-relaxed text-ash">
          Bag, checkout and Stripe land in the next build. This control is intentionally
          inactive until then.
        </p>
      </div>

      <dl className="mt-10 space-y-3 border-t border-stone pt-8 text-[12px]">
        {[
          ["Shipping", "Complimentary over $150, otherwise $8 flat"],
          ["Returns", "30 days unworn, return label included"],
          ["Care", "Cold wash, hang dry, do not tumble"],
        ].map(([term, value]) => (
          <div key={term} className="flex gap-4">
            <dt className="w-24 shrink-0 tracking-[0.14em] text-ash uppercase">{term}</dt>
            <dd className="text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}