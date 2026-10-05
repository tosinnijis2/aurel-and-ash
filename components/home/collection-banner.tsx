import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { ProductArt } from "@/components/product/product-art";
import type { Product } from "@/lib/products";

export function CollectionBanner({ product }: { product?: Product }) {
  return (
    <section className="relative overflow-hidden bg-ink text-bone">
      {/* Art sits behind the copy at low contrast so the type stays dominant. */}
      {product ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.13]">
          <ProductArt
            silhouette={product.silhouette}
            tone="chalk"
            view="detail"
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <Container width="wide" className="relative py-24 lg:py-36">
        <Reveal>
          <p className="text-[11px] tracking-[0.24em] text-bone/60 uppercase">
            The collection
          </p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2.25rem,7vw,4.75rem)] leading-[0.95] font-medium tracking-[-0.04em]">
            Everything you wear,
            <br />
            nothing you <span className="font-serif italic text-brass">don&rsquo;t</span>.
          </h2>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-bone/70">
            Five pieces. Three weights of cotton, one washed canvas, one washed twill. Every
            colour we make works with every other.
          </p>
          <div className="mt-10">
            <ButtonLink href="/shop" variant="light" size="lg">
              Shop Chapter 04
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}