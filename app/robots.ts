import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurel-and-ash.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private and transactional routes from the roadmap stay out of the index.
      disallow: ["/account", "/admin", "/cart", "/checkout"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}