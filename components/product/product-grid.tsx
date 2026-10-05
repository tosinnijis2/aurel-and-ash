import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

const COLUMNS = {
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
} as const;

export function ProductGrid({
  products,
  columns = 3,
  className,
}: {
  products: readonly Product[];
  columns?: keyof typeof COLUMNS;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-x-5 gap-y-12 sm:gap-x-6 lg:gap-y-16",
        COLUMNS[columns],
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}