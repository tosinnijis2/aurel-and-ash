import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/lib/products";

/** The pieces the featured drop leaves out, shown at a larger scale. */
export function RestOfTheLine({ products }: { products: readonly Product[] }) {
  return (
    <section className="border-b border-stone py-20 lg:py-28">
      <Container width="wide">
        <Reveal>
          <SectionHeading
            eyebrow="Rest of the line"
            title="Two pieces still working through their run."
            action={
              <TextLink href="/shop" className="text-[13px]">
                Shop all <ArrowRight className="h-3.5 w-3.5" />
              </TextLink>
            }
          />
        </Reveal>

        <Reveal delay={90} className="mt-12 lg:mt-16">
          <ProductGrid products={products} columns={2} />
        </Reveal>
      </Container>
    </section>
  );
}