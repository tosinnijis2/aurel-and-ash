import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { FeaturedDrop } from "@/components/home/featured-drop";
import { Editorial } from "@/components/home/editorial";
import { CollectionBanner } from "@/components/home/collection-banner";
import { RestOfTheLine } from "@/components/home/rest-of-the-line";
import { Newsletter } from "@/components/marketing/newsletter";
import { getFeaturedProducts, getMerchandisedProducts, getRestOfTheLine } from "@/lib/catalogue";

/**
 * The homepage reads once and passes products down. Every section stays a plain
 * server component with no data access of its own, so what each one renders is
 * decided in one place instead of scattered across the component tree.
 *
 * Dynamic rather than frozen: Vercel's build environment does not need to open
 * database TCP connections while compiling the app. The request runtime reads
 * the catalogue when the page is served.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [slots, featured, rest] = await Promise.all([
    getMerchandisedProducts(),
    getFeaturedProducts(),
    getRestOfTheLine(),
  ]);

  return (
    <>
      <Hero feature={slots.hero} inset={slots.heroInset} />
      <Marquee />
      <FeaturedDrop products={featured} />
      <Editorial product={slots.editorial} />
      <CollectionBanner product={slots.collectionBanner} />
      <RestOfTheLine products={rest} />
      <Newsletter />
    </>
  );
}
