import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductGrid } from "@/components/product/product-grid";
import { formatPrice } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/products";
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from "@/lib/catalogue";

type ProductParams = Promise<{ slug: string }>;

/**
 * Known products are prerendered, and revalidated every minute so a stock count
 * is never more than a minute stale. An unknown slug is not in the params, so
 * it renders on demand and hits the `notFound()` below.
 */
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: ProductParams }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  const title = product.name;
  const description = `${product.tagline}. ${formatPrice(product.priceInCents)}.`;

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} — AUREL & ASH`,
      description,
      url: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: ProductParams }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product, 3);

  return (
    <div className="pb-24">
      <Container width="wide">
        <nav aria-label="Breadcrumb" className="pt-10">
          <ol className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.16em] text-ash uppercase">
            <li>
              <Link href="/" className="transition-colors duration-200 hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="transition-colors duration-200 hover:text-ink">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/shop?category=${product.category}`}
                className="transition-colors duration-200 hover:text-ink"
              >
                {CATEGORY_LABELS[product.category]}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <ProductGallery product={product} />
          <ProductDetail product={product} />
        </div>

        <section className="mt-24 border-t border-stone pt-16 lg:mt-32">
          <Reveal>
            <SectionHeading eyebrow="Pairs well with" title="Complete the rotation." />
          </Reveal>
          <Reveal delay={80} className="mt-12">
            <ProductGrid products={related} columns={3} />
          </Reveal>
        </section>
      </Container>
    </div>
  );
}