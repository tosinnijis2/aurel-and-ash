import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/catalogue";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurel-and-ash.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllProductSlugs();

  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "weekly", priority: 0.9 },
    ...slugs.map((slug) => ({
      url: `${siteUrl}/products/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}