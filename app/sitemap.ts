import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurel-and-ash.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "weekly", priority: 0.9 },
    ...PRODUCTS.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}