import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/lib/products";

export function FeaturedDrop({ products }: { products: readonly Product[] }) {
  return (
    <section className="border-b border-stone py-20 lg:py-28">
      <Container width="wide">
        <Reveal>
          <SectionHeading
            eyebrow="New Arrivals"
            title="Three pieces we're putting weight behind this season."
            action={
              <TextLink href="/shop?sort=newest" className="text-[13px]">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </TextLink>
            }
          />
        </Reveal>

        <Reveal delay={90} className="mt-12 lg:mt-16">
          <ProductGrid products={products} columns={3} />
        </Reveal>
      </Container>
    </section>
  );
}