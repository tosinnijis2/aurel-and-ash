import { NextResponse, type NextRequest } from "next/server";

/**
 * Canonicalise the case of a product slug before it reaches routing.
 *
 * Product pages are prerendered at build time, one artifact per slug. On a
 * case-insensitive filesystem — that is, on Windows — a request for
 * `/products/ESSENTIAL-TEE` resolves to the prerendered `essential-tee.html`
 * before the page component ever runs. The slug guard in `lib/catalogue.ts`
 * therefore never gets to reject it: the request is answered with the product
 * and a 200, and the not-found render that follows overwrites the cached page
 * for the real lowercase slug, which then 404s until the build is discarded.
 *
 * Redirecting a case variant to its canonical form here means every slug that
 * reaches the page is already lowercase, so the guard is never bypassed and no
 * variant can collide with a prerendered artifact. Slugs that differ by more
 * than case have no artifact to collide with, run the page normally, and 404
 * through `notFound()` as they should.
 *
 * The redirect is permanent and preserves the path, so it also keeps a single
 * canonical URL per product for crawlers.
 */
export function middleware(request: NextRequest) {
  const raw = request.nextUrl.pathname.slice("/products/".length);

  let slug: string;
  try {
    slug = decodeURIComponent(raw);
  } catch {
    // Malformed percent-encoding. Nothing to canonicalise, and rewriting a path
    // we cannot decode risks changing what it means — let normal routing 404 it.
    return NextResponse.next();
  }

  if (slug.length > 0 && slug !== slug.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = `/products/${slug.toLowerCase()}`;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/products/:path*",
};