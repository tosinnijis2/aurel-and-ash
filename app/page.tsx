import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { FeaturedDrop } from "@/components/home/featured-drop";
import { Editorial } from "@/components/home/editorial";
import { CollectionBanner } from "@/components/home/collection-banner";
import { RestOfTheLine } from "@/components/home/rest-of-the-line";
import { Newsletter } from "@/components/marketing/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedDrop />
      <Editorial />
      <CollectionBanner />
      <RestOfTheLine />
      <Newsletter />
    </>
  );
}