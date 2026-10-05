# AUREL & ASH

Direct-to-consumer storefront for a fictional lifestyle brand. Next.js App Router,
TypeScript and Tailwind CSS v4.

**Designed for the everyday.**

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script              | Purpose                              |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Development server                   |
| `npm run build`     | Production build                     |
| `npm run start`     | Serve the production build           |
| `npm run lint`      | ESLint                               |
| `npm run typecheck` | `tsc --noEmit`                       |

Copy `.env.example` to `.env.local` to override the public origin used for
canonical URLs, Open Graph tags, the sitemap and `robots.txt`. Everything builds
without it.

## What is built

- `/` — homepage: hero, marquee, featured drop, editorial, collection banner,
  rest of the line, newsletter
- `/shop` — catalogue with category filter, search and sorting, all held in the
  URL so any view is shareable
- `/products/[slug]` — gallery, size and quantity selection, inventory status,
  related products

## What is not built yet

The cart, authentication, Stripe checkout, the account area and the admin
dashboard are deliberately absent. Nothing in the current build pretends to
accept an order: the newsletter form reports that delivery is not connected
rather than confirming a signup that did not happen, and `Add to Bag` is disabled
with the reason shown underneath.

## Structure

```
app/
  layout.tsx            fonts, metadata, header and footer shell
  page.tsx              homepage composition
  shop/page.tsx         catalogue, reads URL search params
  products/[slug]/      product detail, statically generated
  actions/              server actions
  robots.ts sitemap.ts  SEO routes
components/
  layout/               header, mobile menu, footer, announcement bar
  ui/                   button, badge, container, section heading, reveal, icons
  home/                 homepage sections
  product/              card, grid, gallery, detail, vector product artwork
  shop/                 filter controls
  marketing/            newsletter
lib/
  products.ts           catalogue types, seed data and query helpers
  format.ts             currency formatting
  forms.ts              shared form state shapes
```

## Data

`lib/products.ts` holds the seed catalogue. The types mirror the Prisma schema
planned for the next phase, so replacing the module with database queries is a
change of source rather than a change of shape. Every accessor goes through the
functions at the bottom of that file — nothing imports `PRODUCTS` directly for
reads.

Stock state is derived from variant quantities rather than stored, so it cannot
drift out of sync.

## Product imagery

`components/product/product-art.tsx` draws each garment as a technical flat,
rendered at two crops so cards can cross-fade on hover. It is a deliberate
placeholder: replacing it with photography means swapping that one component for
`next/image`, and no consumer changes.

## Design system

Tokens live in `app/globals.css` under `@theme`. The palette is warm and
low-chroma — ink, ash, stone, sand, bone — with brass as the only accent and clay
reserved for validation errors. Motion uses a single easing curve and respects
`prefers-reduced-motion`. Scroll reveals are gated behind a `js` class set before
first paint, so content stays visible when scripting is unavailable.