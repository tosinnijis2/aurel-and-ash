import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProductArt } from "@/components/product/product-art";
import { formatPrice } from "@/lib/format";
import { stockState, type Product } from "@/lib/products";

/** Single label rule, so every grid badges a product the same way. */
function badgeFor(product: Product): { label: string; tone: "ink" | "brass" } | null {
  if (stockState(product) === "LOW_STOCK") return { label: "Low stock", tone: "brass" };
  if (stockState(product) === "OUT_OF_STOCK") return { label: "Sold out", tone: "ink" };
  if (product.featured) return { label: "Featured", tone: "ink" };
  return null;
}

export function ProductCard({ product }: { product: Product }) {
  const badge = badgeFor(product);
  const soldOut = stockState(product) === "OUT_OF_STOCK";
  const [front, detail] = product.views;

  return (
    <article className="group">
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <div className="grain relative aspect-[4/5] overflow-hidden bg-sand">
          <ProductArt
            silhouette={product.silhouette}
            tone={front.tone}
            view="front"
            className="absolute inset-0 h-full w-full transition-[opacity,transform] duration-[600ms] ease-editorial group-hover:scale-[1.03] group-hover:opacity-0 motion-reduce:group-hover:scale-100"
          />
          <ProductArt
            silhouette={product.silhouette}
            tone={detail.tone}
            view="detail"
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[600ms] ease-editorial group-hover:opacity-100 motion-reduce:hidden"
          />

          {badge ? (
            <div className="absolute left-4 top-4">
              <Badge tone={badge.tone}>{badge.label}</Badge>
            </div>
          ) : null}

          {soldOut ? (
            <div className="absolute inset-x-0 bottom-0 bg-bone/80 px-4 py-3 text-center text-[10px] tracking-[0.18em] text-ink-soft uppercase backdrop-blur-sm">
              Currently unavailable
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="text-[15px] leading-tight font-medium tracking-[-0.01em] text-ink">{product.name}</h3>
          <p className="shrink-0 text-[15px] tabular-nums text-ink-soft">{formatPrice(product.priceInCents)}</p>
        </div>
        <p className="mt-1 text-[13px] leading-snug text-ash">{product.tagline}</p>
      </Link>
    </article>
  );
}