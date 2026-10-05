/**
 * Temporary in-memory catalogue for the foundation build.
 *
 * These types mirror the Prisma schema that arrives with the data phase, so the
 * swap to a real database is a change of source, not a change of shape. Nothing
 * in the UI reads this file directly — it goes through the accessors at the
 * bottom, which are the seam the database will replace.
 */

export const PRODUCT_CATEGORIES = ["CLOTHING", "ACCESSORIES"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  CLOTHING: "Clothing",
  ACCESSORIES: "Accessories",
};

/** Stock is derived from variant quantities rather than stored, so it cannot drift. */
export type StockState = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type ProductSilhouette = "hoodie" | "tee" | "cap" | "tote" | "crewneck";

/** Backdrop tone for the product artwork. Every value stays inside the neutral palette. */
export type ProductTone = "bone" | "chalk" | "sand" | "stone" | "ash";

export interface ProductView {
  readonly alt: string;
  readonly tone: ProductTone;
}

export interface ProductVariant {
  /** Size label as shown to the customer, e.g. "M" or "One Size". */
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

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

function variants(quantities: Record<string, number>): ProductVariant[] {
  return APPAREL_SIZES.map((label) => ({ label, quantity: quantities[label] ?? 0 }));
}

const ONE_SIZE: readonly ProductVariant[] = [{ label: "One Size", quantity: 24 }];

export const PRODUCTS: readonly Product[] = [
  {
    id: "prd_crewneck_everyday",
    slug: "everyday-crewneck",
    name: "Everyday Crewneck",
    tagline: "The layer you leave on all day.",
    description:
      "A 400gsm brushed-back fleece crewneck with a set-in rib collar that stays flat through the season. The raglan sleeve removes the bunching under a coat that a dropped seam would otherwise cause. Cut straight through the waist with a slightly lowered shoulder so it layers over a tee without riding up.",
    priceInCents: 18500,
    category: "CLOTHING",
    silhouette: "crewneck",
    views: [
      { alt: "Everyday Crewneck, front view", tone: "chalk" },
      { alt: "Everyday Crewneck, ribbed collar detail", tone: "stone" },
    ],
    variants: variants({ XS: 14, S: 22, M: 18, L: 9, XL: 6, XXL: 2 }),
    featured: false,
    createdAt: "2026-09-28T09:00:00.000Z",
  },
  {
    id: "prd_hoodie_signature",
    slug: "signature-hoodie",
    name: "Signature Hoodie",
    tagline: "Heavyweight loopback, cut for the city.",
    description:
      "A 480gsm loopback cotton hoodie with a double-layer hood that holds its shape through rain and repeat washing. Cuffs and hem are knitted tighter than the body so they recover rather than stretch out at the elbow. The kangaroo pocket sits deep enough to carry without pulling at the shoulders.",
    priceInCents: 14800,
    category: "CLOTHING",
    silhouette: "hoodie",
    views: [
      { alt: "Signature Hoodie, front view", tone: "sand" },
      { alt: "Signature Hoodie, hood and drawcord detail", tone: "chalk" },
    ],
    variants: variants({ XS: 11, S: 19, M: 24, L: 17, XL: 8, XXL: 4 }),
    featured: true,
    createdAt: "2026-09-21T09:00:00.000Z",
  },
  {
    id: "prd_tee_essential",
    slug: "essential-tee",
    name: "Essential Tee",
    tagline: "The one you buy three of.",
    description:
      "220gsm combed cotton jersey, tubular-knit so there are no side seams to twist in the wash. Shoulder-to-shoulder taping keeps the neckline flat under a jacket or a pack strap. Pre-shrunk, garment-dyed, and cut a touch long in the body so it stays put untucked.",
    priceInCents: 5800,
    category: "CLOTHING",
    silhouette: "tee",
    views: [
      { alt: "Essential Tee, front view", tone: "bone" },
      { alt: "Essential Tee, neckline detail", tone: "sand" },
    ],
    variants: variants({ XS: 30, S: 41, M: 38, L: 26, XL: 12, XXL: 5 }),
    featured: true,
    createdAt: "2026-08-30T09:00:00.000Z",
  },
  {
    id: "prd_cap_embroidered",
    slug: "embroidered-cap",
    name: "Embroidered Cap",
    tagline: "Six panels, brass aglet, nothing shouting.",
    description:
      "An unstructured six-panel crown in washed cotton twill, so it packs flat and takes the shape of whatever you wear it under. Chain-stitch embroidered monogram at the front and a brass aglet at the rear. Metal snap closure, not plastic.",
    priceInCents: 4200,
    category: "ACCESSORIES",
    silhouette: "cap",
    views: [
      { alt: "Embroidered Cap, front view", tone: "stone" },
      { alt: "Embroidered Cap, crown panel detail", tone: "bone" },
    ],
    variants: ONE_SIZE.map((v) => ({ ...v, quantity: 3 })),
    featured: true,
    createdAt: "2026-08-12T09:00:00.000Z",
  },
  {
    id: "prd_tote_canvas",
    slug: "canvas-tote",
    name: "Canvas Tote",
    tagline: "18 oz canvas that stands up on its own.",
    description:
      "18 oz cotton canvas with a reinforced flat base, so it holds its shape when the groceries are heavy. Interior slip pocket sized for a 13-inch laptop. Vegetable-tanned leather handles that darken with use rather than cracking.",
    priceInCents: 6800,
    category: "ACCESSORIES",
    silhouette: "tote",
    views: [
      { alt: "Canvas Tote, front view", tone: "ash" },
      { alt: "Canvas Tote, handle detail", tone: "sand" },
    ],
    variants: ONE_SIZE,
    featured: false,
    createdAt: "2026-07-24T09:00:00.000Z",
  },
];

/* -------------------------------------------------------------------------- */
/* Accessors — the seam the database will replace.                            */
/* -------------------------------------------------------------------------- */

export function totalStock(product: Product): number {
  return product.variants.reduce((sum, variant) => sum + variant.quantity, 0);
}

export function stockState(product: Product): StockState {
  const total = totalStock(product);
  if (total <= 0) return "OUT_OF_STOCK";
  if (total <= LOW_STOCK_THRESHOLD) return "LOW_STOCK";
  return "IN_STOCK";
}

export const LOW_STOCK_THRESHOLD = 8;

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

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getFeaturedProducts(): readonly Product[] {
  return PRODUCTS.filter((product) => product.featured);
}

/** Best sellers are fixed editorial picks, not a sales figure we do not have yet. */
export function getBestSellers(): readonly Product[] {
  return [PRODUCTS[1], PRODUCTS[2], PRODUCTS[3], PRODUCTS[0]];
}

export function getRelatedProducts(product: Product, limit = 4): readonly Product[] {
  const sameCategory = PRODUCTS.filter(
    (candidate) => candidate.category === product.category && candidate.id !== product.id,
  );
  const rest = PRODUCTS.filter(
    (candidate) => candidate.category !== product.category && candidate.id !== product.id,
  );
  return [...sameCategory, ...rest].slice(0, limit);
}

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

/** Single filtering path used by /shop so search, filter and sort never disagree. */
export function queryCatalogue({ category, sort = "featured", query }: CatalogueQuery): readonly Product[] {
  const term = query?.trim().toLowerCase();

  const filtered = PRODUCTS.filter((product) => {
    if (category && product.category !== category) return false;
    if (!term) return true;
    return (
      product.name.toLowerCase().includes(term) ||
      product.tagline.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  });

  const sorted = [...filtered];
  switch (sort) {
    case "newest":
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "price-asc":
      sorted.sort((a, b) => a.priceInCents - b.priceInCents);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.priceInCents - a.priceInCents);
      break;
    case "featured":
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }
  return sorted;
}