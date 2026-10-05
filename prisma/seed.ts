/**
 * Development seed for the AUREL & ASH catalogue.
 *
 * Safe to run repeatedly. Every write is an upsert keyed on a natural
 * identifier — the product slug, the variant SKU, and the product/position pair
 * for images — so re-running converges on the same rows instead of duplicating
 * them. Rows that a previous run created and this one no longer lists are
 * removed, so the seed is authoritative rather than additive.
 *
 * It is destructive only within the products below. There is no `deleteMany`
 * against the table as a whole.
 *
 *     npm run db:seed
 */

import { createPrismaClient } from "../lib/db";
import { SINGLE_UNIT_SIZE_KEY } from "../lib/products";

/**
 * The seed is a one-shot process, so it builds its own client and closes it at
 * the end rather than using the app's cached singleton.
 */
const prisma = createPrismaClient();

/** XS → XXL, in the order a customer reads a size run. */
const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

type SeedVariant = { readonly sizeKey: string; readonly quantity: number };

type SeedImage = {
  readonly alt: string;
  readonly tone: "BONE" | "CHALK" | "SAND" | "STONE" | "ASH";
  readonly position: number;
};

type SeedProduct = {
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly priceInCents: number;
  readonly category: "CLOTHING" | "ACCESSORIES";
  readonly silhouette: "HOODIE" | "TEE" | "CAP" | "TOTE" | "CREWNECK";
  readonly featured: boolean;
  readonly createdAt: string;
  /** Prefix for SKU generation, e.g. "AA-HOODIE" → "AA-HOODIE-M". */
  readonly skuPrefix: string;
  readonly variants: readonly SeedVariant[];
  readonly images: readonly SeedImage[];
};

/** Order in this array becomes the variant's stored position, so XS leads. */
function apparel(quantities: Record<(typeof APPAREL_SIZES)[number], number>): SeedVariant[] {
  return APPAREL_SIZES.map((sizeKey) => ({ sizeKey, quantity: quantities[sizeKey] }));
}

function singleUnit(quantity: number): SeedVariant[] {
  return [{ sizeKey: SINGLE_UNIT_SIZE_KEY, quantity }];
}

const CATALOGUE: readonly SeedProduct[] = [
  {
    slug: "everyday-crewneck",
    name: "Everyday Crewneck",
    tagline: "The layer you leave on all day.",
    description:
      "A 400gsm brushed-back fleece crewneck with a set-in rib collar that stays flat through the season. The raglan sleeve removes the bunching under a coat that a dropped seam would otherwise cause. Cut straight through the waist with a slightly lowered shoulder so it layers over a tee without riding up.",
    priceInCents: 18500,
    category: "CLOTHING",
    silhouette: "CREWNECK",
    featured: false,
    createdAt: "2026-09-28T09:00:00.000Z",
    skuPrefix: "AA-CREW",
    variants: apparel({ XS: 14, S: 22, M: 18, L: 9, XL: 6, XXL: 2 }),
    images: [
      { alt: "Everyday Crewneck, front view", tone: "CHALK", position: 0 },
      { alt: "Everyday Crewneck, ribbed collar detail", tone: "STONE", position: 1 },
    ],
  },
  {
    slug: "signature-hoodie",
    name: "Signature Hoodie",
    tagline: "Heavyweight loopback, cut for the city.",
    description:
      "A 480gsm loopback cotton hoodie with a double-layer hood that holds its shape through rain and repeat washing. Cuffs and hem are knitted tighter than the body so they recover rather than stretch out at the elbow. The kangaroo pocket sits deep enough to carry without pulling at the shoulders.",
    priceInCents: 14800,
    category: "CLOTHING",
    silhouette: "HOODIE",
    featured: true,
    createdAt: "2026-09-21T09:00:00.000Z",
    skuPrefix: "AA-HOODIE",
    variants: apparel({ XS: 11, S: 19, M: 24, L: 17, XL: 8, XXL: 4 }),
    images: [
      { alt: "Signature Hoodie, front view", tone: "SAND", position: 0 },
      { alt: "Signature Hoodie, hood and drawcord detail", tone: "CHALK", position: 1 },
    ],
  },
  {
    slug: "essential-tee",
    name: "Essential Tee",
    tagline: "The one you buy three of.",
    description:
      "220gsm combed cotton jersey, tubular-knit so there are no side seams to twist in the wash. Shoulder-to-shoulder taping keeps the neckline flat under a jacket or a pack strap. Pre-shrunk, garment-dyed, and cut a touch long in the body so it stays put untucked.",
    priceInCents: 5800,
    category: "CLOTHING",
    silhouette: "TEE",
    featured: true,
    createdAt: "2026-08-30T09:00:00.000Z",
    skuPrefix: "AA-TEE",
    variants: apparel({ XS: 30, S: 41, M: 38, L: 26, XL: 12, XXL: 5 }),
    images: [
      { alt: "Essential Tee, front view", tone: "BONE", position: 0 },
      { alt: "Essential Tee, neckline detail", tone: "SAND", position: 1 },
    ],
  },
  {
    slug: "embroidered-cap",
    name: "Embroidered Cap",
    tagline: "Six panels, brass aglet, nothing shouting.",
    description:
      "An unstructured six-panel crown in washed cotton twill, so it packs flat and takes the shape of whatever you wear it under. Chain-stitch embroidered monogram at the front and a brass aglet at the rear. Metal snap closure, not plastic.",
    priceInCents: 4200,
    category: "ACCESSORIES",
    silhouette: "CAP",
    featured: true,
    createdAt: "2026-08-12T09:00:00.000Z",
    skuPrefix: "AA-CAP",
    // A cap has no size run. One variant carries the stock; the storefront
    // recognises the single-unit key and renders no size selector.
    variants: singleUnit(3),
    images: [
      { alt: "Embroidered Cap, front view", tone: "STONE", position: 0 },
      { alt: "Embroidered Cap, crown panel detail", tone: "BONE", position: 1 },
    ],
  },
  {
    slug: "canvas-tote",
    name: "Canvas Tote",
    tagline: "18 oz canvas that stands up on its own.",
    description:
      "18 oz cotton canvas with a reinforced flat base, so it holds its shape when the groceries are heavy. Interior slip pocket sized for a 13-inch laptop. Vegetable-tanned leather handles that darken with use rather than cracking.",
    priceInCents: 6800,
    category: "ACCESSORIES",
    silhouette: "TOTE",
    featured: false,
    createdAt: "2026-07-24T09:00:00.000Z",
    skuPrefix: "AA-TOTE",
    variants: singleUnit(24),
    images: [
      { alt: "Canvas Tote, front view", tone: "ASH", position: 0 },
      { alt: "Canvas Tote, handle detail", tone: "SAND", position: 1 },
    ],
  },
];

/**
 * Prices are written as exact decimal strings, never as numbers. A float would
 * turn 148.00 into 147.99999999999997 somewhere downstream, and money is not
 * allowed to drift.
 */
function toDecimalString(cents: number): string {
  return (cents / 100).toFixed(2);
}

async function seedProduct(seed: SeedProduct): Promise<void> {
  const product = await prisma.product.upsert({
    where: { slug: seed.slug },
    create: {
      name: seed.name,
      slug: seed.slug,
      tagline: seed.tagline,
      description: seed.description,
      price: toDecimalString(seed.priceInCents),
      category: seed.category,
      silhouette: seed.silhouette,
      featured: seed.featured,
      createdAt: new Date(seed.createdAt),
    },
    update: {
      name: seed.name,
      tagline: seed.tagline,
      description: seed.description,
      price: toDecimalString(seed.priceInCents),
      category: seed.category,
      silhouette: seed.silhouette,
      featured: seed.featured,
      // createdAt is intentionally not updated: it records when the product
      // entered the catalogue, which a re-seed must not rewrite.
    },
    select: { id: true },
  });

  const skus = seed.variants.map((variant) => `${seed.skuPrefix}-${variant.sizeKey.toUpperCase()}`);

  for (const [index, variant] of seed.variants.entries()) {
    await prisma.productVariant.upsert({
      where: { sku: skus[index] },
      create: {
        productId: product.id,
        sizeKey: variant.sizeKey,
        position: index,
        quantity: variant.quantity,
        sku: skus[index],
      },
      update: {
        productId: product.id,
        sizeKey: variant.sizeKey,
        position: index,
        quantity: variant.quantity,
      },
    });
  }

  // Drop variants this product no longer has, so a size removed from the seed
  // does not linger and keep contributing stock.
  await prisma.productVariant.deleteMany({
    where: { productId: product.id, sku: { notIn: skus } },
  });

  for (const image of seed.images) {
    await prisma.productImage.upsert({
      where: { productId_position: { productId: product.id, position: image.position } },
      create: {
        productId: product.id,
        alt: image.alt,
        tone: image.tone,
        position: image.position,
      },
      update: { alt: image.alt, tone: image.tone },
    });
  }

  await prisma.productImage.deleteMany({
    where: { productId: product.id, position: { gte: seed.images.length } },
  });
}

async function main(): Promise<void> {
  for (const seed of CATALOGUE) {
    await seedProduct(seed);
    console.log(`seeded ${seed.slug}`);
  }

  const [products, variants, images] = await Promise.all([
    prisma.product.count(),
    prisma.productVariant.count(),
    prisma.productImage.count(),
  ]);

  console.log(`\n${products} products, ${variants} variants, ${images} images.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
