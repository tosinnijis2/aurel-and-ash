import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { ShopFilters } from "@/components/shop/shop-filters";
import { isProductCategory, isSortOption } from "@/lib/products";
import { queryCatalogue } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The full AUREL & ASH collection — heavyweight hoodies, crewnecks, tees and washed canvas accessories.",
  alternates: { canonical: "/shop" },
};

type ShopSearchParams = Promise<{
  category?: string | string[];
  sort?: string | string[];
  q?: string | string[];
}>;

/** Only the first value of a repeated param is meaningful, so normalise once. */
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({ searchParams }: { searchParams: ShopSearchParams }) {
  const params = await searchParams;

  const categoryParam = first(params.category);
  const sortParam = first(params.sort);
  const query = first(params.q)?.trim();

  const products = await queryCatalogue({
    category: isProductCategory(categoryParam) ? categoryParam : undefined,
    sort: isSortOption(sortParam) ? sortParam : "featured",
    query,
  });

  return (
    <div className="pb-24">
      <Container width="wide">
        <header className="pt-14 pb-10 lg:pt-20 lg:pb-14">
          <p className="text-[11px] tracking-[0.24em] text-ash uppercase">The collection</p>
          <h1 className="mt-5 text-[clamp(2.25rem,6.5vw,4.25rem)] leading-[0.95] font-medium tracking-[-0.04em]">
            Everything we make.
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Five pieces in three weights of cotton, one washed canvas and one washed twill.
            Restocks are small and irregular.
          </p>
        </header>

        <ShopFilters total={products.length} />

        <div className="pt-12 lg:pt-16">
          {products.length > 0 ? (
            <ProductGrid products={products} columns={4} />
          ) : (
            <div className="border border-stone px-6 py-20 text-center">
              <p className="text-[15px] font-medium">No pieces match that search.</p>
              <p className="mt-2 text-[13px] text-ink-soft">
                Try a broader term, or clear the category filter.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}