import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center py-24">
      <Container width="narrow">
        <p className="text-[11px] tracking-[0.24em] text-ash uppercase">Error 404</p>
        <h1 className="mt-5 text-[clamp(2.25rem,6vw,3.75rem)] leading-[0.98] font-medium tracking-[-0.04em]">
          This page has been retired.
        </h1>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
          The link may be out of date, or the piece may have sold through. Everything currently
          in stock is one click away.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/shop" size="lg">
            Shop the collection
          </ButtonLink>
          <ButtonLink href="/" variant="outline" size="lg">
            Back home
          </ButtonLink>
        </div>
        <p className="mt-10 text-[13px] text-ash">
          Or{" "}
          <Link href="/shop" className="underline-sweep text-ink">
            browse everything we make
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}