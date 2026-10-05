import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ProductArt } from "@/components/product/product-art";
import { PRODUCTS } from "@/lib/products";

const SUBJECT = PRODUCTS[4];

const PRINCIPLES = [
  ["Fabric first", "Weight and hand-feel decide everything. GSM is quoted on every product page."],
  ["Small runs", "We produce in batches rather than seasons, so nothing sits waiting for a discount."],
  ["Built to repair", "Seams are left accessible, so a worn cuff is a reknit rather than a replacement."],
] as const;

export function Editorial() {
  return (
    <section id="editorial" className="scroll-mt-24 border-b border-stone bg-bone-deep py-20 lg:py-28">
      <Container width="wide">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="grain relative aspect-[5/6] overflow-hidden">
              <ProductArt
                silhouette={SUBJECT.silhouette}
                tone={SUBJECT.views[0].tone}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="mt-4 text-[11px] tracking-[0.2em] text-ash uppercase">
              {SUBJECT.name} — {SUBJECT.tagline}
            </p>
          </Reveal>

          <Reveal delay={90}>
            <p className="text-[11px] tracking-[0.24em] text-ash uppercase">Editorial</p>

            <blockquote className="mt-7 text-[clamp(1.5rem,3.6vw,2.45rem)] leading-[1.1] font-medium tracking-[-0.035em]">
              A wardrobe isn&rsquo;t a pile of{" "}
              <span className="font-serif text-brass-ink italic">new</span> things. It&rsquo;s the
              ten you reach for without thinking.
            </blockquote>

            <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-ink-soft">
              We started AUREL &amp; ASH because the good version of a basic hoodie rarely exists
              at a price that makes sense. So we made five things instead of fifty, spent the
              budget on the cloth, and left the rest of the label off the chest.
            </p>

            <dl className="mt-10 space-y-6 border-t border-stone pt-8">
              {PRINCIPLES.map(([title, body]) => (
                <div key={title}>
                  <dt className="text-[13px] font-medium">{title}</dt>
                  <dd className="mt-1 max-w-md text-[13px] leading-relaxed text-ink-soft">{body}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <ButtonLink href="/shop" variant="outline">
                See what we make
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}