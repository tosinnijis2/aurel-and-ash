import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRight } from "@/components/ui/icons";
import { ProductArt } from "@/components/product/product-art";
import { PRODUCTS } from "@/lib/products";

const HERO_PRODUCT = PRODUCTS[1];
const DETAIL_PRODUCT = PRODUCTS[3];

export function Hero() {
  return (
    <section className="border-b border-stone">
      <Container width="wide" className="grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-24">
        <div>
          <p className="text-[11px] tracking-[0.24em] text-ash uppercase">
            Chapter 04 — Autumn / Winter
          </p>

          <h1 className="mt-7 text-[clamp(2.75rem,8.5vw,6rem)] leading-[0.9] font-medium tracking-[-0.045em]">
            Designed for
            <br />
            the <span className="font-serif text-brass-ink italic">everyday</span>.
          </h1>

          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Five pieces, made in limited runs from heavyweight cotton and washed canvas.
            Cut to be worn until they wear out, not until the season turns.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="/shop" size="lg">
              Shop the Collection
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/shop?sort=newest" variant="outline" size="lg">
              New Arrivals
            </ButtonLink>
          </div>

          <dl className="mt-14 flex gap-10 border-t border-stone pt-8 sm:gap-14">
            {[
              ["Pieces", "05"],
              ["Fabric", "220–480 gsm"],
              ["Runs", "Limited"],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="text-[10px] tracking-[0.2em] text-ash uppercase">{term}</dt>
                <dd className="mt-1.5 text-[15px] font-medium tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <div className="grain relative aspect-[4/5] overflow-hidden">
            <ProductArt
              silhouette={HERO_PRODUCT.silhouette}
              tone={HERO_PRODUCT.views[0].tone}
              className="absolute inset-0 h-full w-full"
            />
          </div>

          <div className="absolute right-5 bottom-5 w-[38%] min-w-[120px] border border-bone bg-bone shadow-[0_18px_40px_-24px_rgba(18,17,16,0.45)]">
            <div className="grain relative aspect-square">
              <ProductArt
                silhouette={DETAIL_PRODUCT.silhouette}
                tone={DETAIL_PRODUCT.views[1].tone}
                view="detail"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="bg-bone px-3 py-2 text-[9px] tracking-[0.18em] text-ink-soft uppercase">
              {DETAIL_PRODUCT.name}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}