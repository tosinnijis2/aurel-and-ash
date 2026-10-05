"use client";

import { useState } from "react";
import { ProductArt } from "@/components/product/product-art";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const current = product.views[active] ?? product.views[0];

  return (
    <div>
      <figure className="grain relative aspect-[4/5] overflow-hidden">
        <ProductArt
          silhouette={product.silhouette}
          tone={current.tone}
          view={active === 0 ? "front" : "detail"}
          className="absolute inset-0 h-full w-full"
        />
        <figcaption className="sr-only">{current.alt}</figcaption>
      </figure>

      <div role="group" aria-label={`${product.name} images`} className="mt-4 flex gap-3">
        {product.views.map((view, index) => (
          <button
            key={view.alt}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={index === active}
            aria-label={`Show image ${index + 1} of ${product.views.length}: ${view.alt}`}
            className={cn(
              "grain relative aspect-[4/5] w-20 shrink-0 overflow-hidden border transition-colors duration-300 ease-editorial",
              index === active ? "border-ink" : "border-stone hover:border-ash",
            )}
          >
            <ProductArt
              silhouette={product.silhouette}
              tone={view.tone}
              view={index === 0 ? "front" : "detail"}
              className="absolute inset-0 h-full w-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}