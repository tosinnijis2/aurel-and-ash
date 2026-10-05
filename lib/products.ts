/**
 * Catalogue domain types, constants and pure helpers.
 *
 * This module is the storefront's view of a product, not a way of fetching one.
 * It is deliberately free of Prisma and of any I/O so that client components
 * can import the vocabulary they need — sort labels, category labels, the stock
 * rules — without pulling a database driver into the browser bundle.
 *
 * Reading products is the job of `lib/catalogue.ts`, which is server-only and
 * maps database rows into the `Product` shape declared below. The UI depends on
 * this file and never on the other.
 */

export const PRODUCT_CATEGORIES = ["CLOTHING", "ACCESSORIES"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  CLOTHING: "Clothing",
  ACCESSORIES: "Accessories",
};

/** Stock is derived from variant quantities rather than stored, so it cannot drift. */
export type StockState = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

/**
 * The variant key a product sold as one unit — a cap, a tote — stores instead
 * of a size.
 *
 * It is a storage convention, not a size: no customer ever sees it. Writing a
 * literal "One Size" into the database would be a fabricated value that exists
 * only to fill a not-null column, so the key lives here and the interface
 * decides what to do with it.
 */
export const SINGLE_UNIT_SIZE_KEY = "std";

/**
 * Label used for a single-unit variant. Shown nowhere: `requiresSize` is false
 * for a one-variant product, so the size selector is never rendered. It exists
 * because the size button still needs a stable React key.
 */
export const SINGLE_UNIT_LABEL = "One Size";

export type ProductSilhouette = "hoodie" | "tee" | "cap" | "tote" | "crewneck";

/** Backdrop tone for the product artwork. Every value stays inside the neutral palette. */
export type ProductTone = "bone" | "chalk" | "sand" | "stone" | "ash";

export interface ProductView {
  readonly alt: string;
  readonly tone: ProductTone;
}

export interface ProductVariant {
  /**
   * Size label as shown to the customer, e.g. "M".
   *
   * A product with a single variant carries a placeholder label because the
   * interface requires one; that product has no size run, so the storefront
   * renders no size selector and the label is never shown as a choice.
   */
  readonly label: string;
  readonly quantity: number;
}

export interface Product {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  /** One-line editorial summary shown under the product name on cards. */
  readonly tagline: string;
  readonly description: string;
  /** Integer cents. Never a float, never a pre-formatted string. */
  readonly priceInCents: number;
  readonly category: ProductCategory;
  readonly silhouette: ProductSilhouette;
  /** Two views so cards can cross-fade on hover, the way a photo shoot would. */
  readonly views: readonly [ProductView, ProductView];
  readonly variants: readonly ProductVariant[];
  readonly featured: boolean;
  /** ISO 8601. Fixed rather than relative so "newest" sort is deterministic. */
  readonly createdAt: string;
}

/* -------------------------------------------------------------------------- */
/* Inventory rules                                                            */
/* -------------------------------------------------------------------------- */

export const LOW_STOCK_THRESHOLD = 8;

export function totalStock(product: Product): number {
  return product.variants.reduce((sum, variant) => sum + variant.quantity, 0);
}

export function stockState(product: Product): StockState {
  const total = totalStock(product);
  if (total <= 0) return "OUT_OF_STOCK";
  if (total <= LOW_STOCK_THRESHOLD) return "LOW_STOCK";
  return "IN_STOCK";
}

export function isInStock(product: Product): boolean {
  return totalStock(product) > 0;
}

/** Clothing cannot be bought without a size, so those products must offer one. */
export function requiresSize(product: Product): boolean {
  return product.variants.length > 1;
}

export function variantIsAvailable(product: Product, label: string): boolean {
  return product.variants.some((v) => v.label === label && v.quantity > 0);
}

/* -------------------------------------------------------------------------- */
/* Browsing vocabulary                                                        */
/* -------------------------------------------------------------------------- */

export const SORT_OPTIONS = ["featured", "newest", "price-asc", "price-desc"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export function isSortOption(value: string | undefined): value is SortOption {
  return SORT_OPTIONS.includes(value as SortOption);
}

export function isProductCategory(value: string | undefined): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

export interface CatalogueQuery {
  readonly category?: ProductCategory;
  readonly sort?: SortOption;
  readonly query?: string;
}
