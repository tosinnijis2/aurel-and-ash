/**
 * Server-only catalogue queries.
 *
 * This is where the storefront reads products. Rows come back as Prisma types
 * and are mapped into the plain `Product` shape from `lib/products.ts` before
 * they leave this module, so nothing downstream has to know a database exists.
 *
 * The split is deliberate: `lib/products.ts` stays importable from client
 * components, this file is not. `server-only` makes that boundary an error at
 * build time rather than a leak found in a bundle later.
 *
 * Ordering rules are stated once here. `NEWEST_FIRST` matches the order the
 * storefront shipped its first catalogue in, which is why "newest", "featured"
 * and related-product ordering reproduce the previous hand-authored results
 * without a visual change.
 */

import "server-only";

import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  SINGLE_UNIT_LABEL,
  SINGLE_UNIT_SIZE_KEY,
  isProductCategory,
  type CatalogueQuery,
  type Product,
  type ProductCategory,
  type ProductSilhouette,
  type ProductTone,
  type SortOption,
} from "@/lib/products";

const PRODUCT_INCLUDE = {
  variants: { orderBy: { position: "asc" } },
  images: { orderBy: { position: "asc" } },
} satisfies Prisma.ProductInclude;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof PRODUCT_INCLUDE }>;

/**
 * Newest first, then id as a tiebreaker so paging through equal timestamps is
 * still deterministic rather than whatever order the planner felt like.
 */
const NEWEST_FIRST = [
  { createdAt: "desc" },
  { id: "asc" },
] satisfies Prisma.ProductOrderByWithRelationInput[];

/* -------------------------------------------------------------------------- */
/* Input guards                                                                */
/* -------------------------------------------------------------------------- */

/**
 * A slug is a lowercase URL path segment: words joined by single hyphens.
 *
 * Anything else is a malformed request rather than a catalogue miss. Checking
 * before the query matters for more than tidiness — a path segment carrying a
 * NUL byte makes PostgreSQL reject the whole statement with `invalid byte
 * sequence for encoding "UTF8"`, turning what should be a 404 into a 500.
 * Returning null lets the caller raise the 404 it already raises for a slug
 * that simply is not in the catalogue.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * PostgreSQL `text` cannot hold a NUL byte, so a search term containing one can
 * never match anything — but passing it through fails while the parameter is
 * being encoded, which takes the whole page down. Such a term matches nothing.
 */
function canMatchStoredText(term: string): boolean {
  return !term.includes("\u0000");
}

/* -------------------------------------------------------------------------- */
/* Row → view mapping                                                          */
/* -------------------------------------------------------------------------- */

const SILHOUETTES = {
  HOODIE: "hoodie",
  TEE: "tee",
  CAP: "cap",
  TOTE: "tote",
  CREWNECK: "crewneck",
} as const satisfies Record<string, ProductSilhouette>;

const TONES = {
  BONE: "bone",
  CHALK: "chalk",
  SAND: "sand",
  STONE: "stone",
  ASH: "ash",
} as const satisfies Record<string, ProductTone>;

/**
 * The database enums are upper-case and the view types are lower-case. These
 * translate between them, and throw on an unknown value rather than rendering
 * `undefined` into a class name — a new enum value that the UI cannot draw is a
 * deployment mistake worth failing loudly on.
 */
function toSilhouette(value: string): ProductSilhouette {
  const silhouette = SILHOUETTES[value as keyof typeof SILHOUETTES];
  if (!silhouette) throw new Error(`Unknown product silhouette "${value}".`);
  return silhouette;
}

function toTone(value: string): ProductTone {
  const tone = TONES[value as keyof typeof TONES];
  if (!tone) throw new Error(`Unknown product tone "${value}".`);
  return tone;
}

function toCategory(value: string): ProductCategory {
  if (!isProductCategory(value)) throw new Error(`Unknown product category "${value}".`);
  return value;
}

/**
 * Decimal in the column, integer cents in the interface.
 *
 * The conversion happens once, here. Every price the UI ever sees is therefore
 * an exact integer, and no arithmetic downstream can introduce a float.
 */
function toCents(price: Prisma.Decimal): number {
  return price.mul(100).toNumber();
}

function toProduct(row: ProductRow): Product {
  const [front, detail] = row.images;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    priceInCents: toCents(row.price),
    category: toCategory(row.category),
    silhouette: toSilhouette(row.silhouette),
    views: [
      {
        // Generated artwork rather than photography. ProductImage rows carry the
        // alt text and backdrop tone, and their `url` stays null until a shoot
        // exists — so a product with no image row still renders the flat
        // instead of an empty frame.
        alt: front?.alt ?? `${row.name}, front view`,
        tone: toTone(front?.tone ?? "BONE"),
      },
      {
        alt: detail?.alt ?? `${row.name}, detail view`,
        tone: toTone(detail?.tone ?? "SAND"),
      },
    ],
    variants: row.variants.map((variant) => ({
      label: variant.sizeKey === SINGLE_UNIT_SIZE_KEY ? SINGLE_UNIT_LABEL : variant.sizeKey,
      quantity: variant.quantity,
    })),
    featured: row.featured,
    createdAt: row.createdAt.toISOString(),
  };
}

function toProducts(rows: ProductRow[]): Product[] {
  return rows.map(toProduct);
}

/* -------------------------------------------------------------------------- */
/* Reads                                                                       */
/* -------------------------------------------------------------------------- */

/** Every product slug, newest first. Backs the sitemap and static generation. */
export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    select: { slug: true },
    orderBy: NEWEST_FIRST,
  });
  return rows.map((row) => row.slug);
}

/**
 * One product, or null if the slug is malformed or unknown. Callers cannot tell
 * the two apart, which is right: from the storefront both are "no such page".
 *
 * Wrapped in React's request-scoped cache because a product request reads this
 * slug twice — once in `generateMetadata`, once in the page — and the second
 * read should not cost a second round trip.
 */
export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  if (!SLUG_PATTERN.test(slug)) return null;

  const row = await prisma.product.findUnique({ where: { slug }, include: PRODUCT_INCLUDE });
  return row ? toProduct(row) : null;
});

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { featured: true },
    orderBy: NEWEST_FIRST,
    include: PRODUCT_INCLUDE,
  });
  return toProducts(rows);
}

/** Everything the featured drop does not already show. */
export async function getRestOfTheLine(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { featured: false },
    orderBy: NEWEST_FIRST,
    include: PRODUCT_INCLUDE,
  });
  return toProducts(rows);
}

/**
 * Same category first, then everything else, each half newest first. Ordering
 * is by category membership and recency only — no sales data to rank by yet.
 */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { id: { not: product.id } },
    orderBy: NEWEST_FIRST,
    include: PRODUCT_INCLUDE,
  });

  const candidates = toProducts(rows);
  const sameCategory = candidates.filter((candidate) => candidate.category === product.category);
  const otherCategories = candidates.filter((candidate) => candidate.category !== product.category);

  return [...sameCategory, ...otherCategories].slice(0, limit);
}

/**
 * The fixed products the homepage places by hand. Named by slug rather than by
 * position, because row order is something the database owns and merchandising
 * is an editorial decision.
 */
const MERCHANDISING_SLUGS = {
  hero: "signature-hoodie",
  heroInset: "embroidered-cap",
  editorial: "canvas-tote",
  collectionBanner: "everyday-crewneck",
} as const;

export type MerchandisedSlots = {
  readonly [Slot in keyof typeof MERCHANDISING_SLUGS]: Product | undefined;
};

/** One query for every hand-placed homepage product. Missing slots are undefined. */
export async function getMerchandisedProducts(): Promise<MerchandisedSlots> {
  const rows = await prisma.product.findMany({
    where: { slug: { in: Object.values(MERCHANDISING_SLUGS) } },
    include: PRODUCT_INCLUDE,
  });

  const bySlug = new Map(rows.map((row) => [row.slug, toProduct(row)]));
  const slot = (name: keyof typeof MERCHANDISING_SLUGS) => bySlug.get(MERCHANDISING_SLUGS[name]);

  return {
    hero: slot("hero"),
    heroInset: slot("heroInset"),
    editorial: slot("editorial"),
    collectionBanner: slot("collectionBanner"),
  };
}

/* -------------------------------------------------------------------------- */
/* Browsing                                                                    */
/* -------------------------------------------------------------------------- */

const ORDER_BY: Record<SortOption, Prisma.ProductOrderByWithRelationInput[]> = {
  featured: [{ featured: "desc" }, { createdAt: "desc" }, { id: "asc" }],
  newest: NEWEST_FIRST,
  "price-asc": [{ price: "asc" }, { id: "asc" }],
  "price-desc": [{ price: "desc" }, { id: "asc" }],
};

/**
 * The single filtering path used by /shop, so the search box, the category
 * filter and the sort control can never disagree about which products are in
 * view. Filtering, searching and sorting all happen in the database rather than
 * over an array, so this stays correct as the catalogue grows.
 */
export async function queryCatalogue({
  category,
  sort = "featured",
  query,
}: CatalogueQuery): Promise<Product[]> {
  const term = query?.trim();

  if (term && !canMatchStoredText(term)) return [];

  const rows = await prisma.product.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(term
        ? {
            OR: [
              { name: { contains: term, mode: "insensitive" } },
              { tagline: { contains: term, mode: "insensitive" } },
              { description: { contains: term, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: ORDER_BY[sort],
    include: PRODUCT_INCLUDE,
  });

  return toProducts(rows);
}