# AUREL & ASH

Direct-to-consumer storefront for a fictional lifestyle brand. Next.js App Router,
TypeScript, Tailwind CSS v4, Prisma and PostgreSQL.

**Designed for the everyday.**

## Getting started

```bash
npm install
cp .env.example .env          # then set DATABASE_URL and DIRECT_URL
npm run db:deploy             # create the schema
npm run db:seed               # load the catalogue
npm run dev                   # http://localhost:3000
```

`DATABASE_URL` must be the pooled Prisma Postgres URL for application runtime
queries. It should use the `pooled.db.prisma.io` hostname. `DIRECT_URL` must be
the direct Prisma Postgres URL for Prisma CLI work such as migrations,
introspection and Prisma Studio. It should use the `db.prisma.io` hostname.

### The database

A hosted Prisma Postgres database. `DATABASE_URL` is the pooled connection used
by the Next.js app and seed script at runtime. `DIRECT_URL` is the direct
connection used by Prisma CLI operations. Keep migrations on `DIRECT_URL` so
`npm run db:deploy` talks to `db.prisma.io` rather than the pooled runtime host.

`npm run db:deploy` (`prisma migrate deploy`) is the migration command for
production and CI. It applies the committed migrations to the real database and
nothing else through `DIRECT_URL`. `npm run db:migrate` (`prisma migrate dev`) is for authoring
migrations during development; it replays them against a throwaway copy of the
database, which needs a role with CREATE DATABASE. If your provider withholds
that, set `SHADOW_DATABASE_URL` to a scratch database — see `.env.example`.
`migrate deploy` never reads `SHADOW_DATABASE_URL`.

`db push` is not used anywhere. It bypasses the migration history, so a
production database could drift from the migrations without anyone noticing.

| Script              | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Development server                          |
| `npm run build`     | Generate the client, then production build  |
| `npm run start`     | Serve the production build                  |
| `npm run lint`      | ESLint                                      |
| `npm run typecheck` | `tsc --noEmit`                              |
| `npm run test`      | Cart state and rendered-component assertions |
| `npm run test:cart` | Cart state only (needs `DATABASE_URL`)      |
| `npm run test:ui`   | Rendered components only, no database       |
| `npm run test:pages`| Routes and served markup (needs a running server) |
| `npm run db:migrate`| Author a migration in development           |
| `npm run db:deploy` | Apply pending migrations (use in CI/production) |
| `npm run db:seed`   | Load the seed catalogue                     |
| `npm run db:generate` | Regenerate Prisma Client after a schema edit |

## What is built

- `/` — homepage: hero, marquee, featured drop, editorial, collection banner,
  rest of the line, newsletter
- `/shop` — catalogue with category filter, search and sorting, all held in the
  URL so any view is shareable
- `/products/[slug]` — gallery, size and quantity selection, inventory status,
  related products
- `/cart` — the bag: a line per variant, quantity controls, an exact subtotal,
  and a checkout control that is deliberately inert

## What is not built yet

Authentication, Stripe checkout, orders, the account area, wishlists, promo
codes, shipping and tax calculations, and the admin dashboard are deliberately
absent. Nothing in the current build pretends to accept an order: the newsletter
form reports that delivery is not connected rather than confirming a signup that
did not happen, and the cart's Checkout button is disabled with the reason shown
underneath.

## The cart

The bag is a client-side store over `localStorage`. It is small enough that a
state library would be more machinery than the problem needs, and small enough to
read in one sitting — `lib/cart.ts` is pure functions over plain data, with no
React and no browser APIs, and `components/cart/cart-provider.tsx` is the only
module that touches storage.

**A line is a variant.** `CartLine.variantId` holds the real
`ProductVariant.id`, the same primary key the catalogue query returned. Two sizes
of one product are two variants and therefore two lines; adding the same variant
again increments it rather than duplicating it. There is no second identity
system, and nothing has to be kept in step with the database's.

**Prices stay exact.** The `Decimal` is converted to integer cents once, in
`toCents`, at the edge where a row becomes a DTO. Every cart operation —
`unitPriceInCents * quantity`, and the subtotal that sums those — is integer
arithmetic, and formatting happens only at render through the existing
`formatPrice`. No float ever touches a currency value.

**Stock is a UX ceiling, not a reservation.** A line carries the variant's
quantity as `maxQuantity`, which is what stops the interface from offering more
than is on hand. It is a snapshot, and the database stays the source of truth:
checkout must re-read product existence, price, variant and stock on the server
before taking any money. Nothing in the cart is trusted for that.

**Stored shape.** `localStorage["aurel-and-ash:cart"]` holds

```json
{ "version": 1, "lines": [ { "variantId": "...", "productId": "...", "slug": "...",
  "name": "...", "size": "M", "unitPriceInCents": 14800, "quantity": 2,
  "maxQuantity": 24, "silhouette": "hoodie", "tone": "bone" } ] }
```

`size` is `null` for a product with no size run — the database's internal `std`
key is never persisted and never displayed. `parseCart` returns an empty bag for
anything it does not recognise: malformed JSON, a payload from another version,
or individual lines with impossible values. A corrupt entry costs you that line,
not the page.

**Hydration.** `localStorage` is modelled as a React external store and read
through `useSyncExternalStore`, so the server and the hydration pass agree that
the bag is empty and the real contents appear one paint later, with no mismatch.
`useCartHydration()` exposes that boundary so the bag UI holds back a loading
state instead of flashing an empty bag at someone who has items.

## Structure

```
app/
  layout.tsx            fonts, metadata, header and footer shell
  page.tsx              homepage composition
  cart/page.tsx         the bag route
  shop/page.tsx         catalogue, reads URL search params
  products/[slug]/      product detail, statically generated
  actions/              server actions
  robots.ts sitemap.ts  SEO routes
components/
  layout/               header, mobile menu, footer, announcement bar
  cart/                 provider, header link, bag view, line and summary
  ui/                   button, badge, container, section heading, reveal, icons
  home/                 homepage sections
  product/              card, grid, gallery, detail, vector product artwork
  shop/                 filter controls
  marketing/            newsletter
lib/
  cart.ts               pure cart state: lines, totals, parsing, storage shape
  products.ts           catalogue types, constants and pure helpers
  catalogue.ts          server-only: the Prisma-backed queries
  prisma.ts             server-only: the shared client, cached across hot reloads
  db.ts                 client construction, shared with the seed script
  format.ts             currency formatting
  forms.ts              shared form state shapes
scripts/
  verify-cart.mts       cart state assertions, against real variant ids
  verify-cart-ui.tsx    rendered-component assertions
  verify-cart-pages.mts routes and served markup
prisma/
  schema.prisma         Product, ProductVariant, ProductImage
  seed.ts               idempotent catalogue seed
  migrations/           generated SQL, applied by db:migrate / db:deploy
proxy.ts                redirects case-variant product slugs to their canonical form
```

## Data

The catalogue lives in PostgreSQL. `lib/catalogue.ts` is the only module that
reads it; it maps rows into the plain `Product` shape declared in
`lib/products.ts` and hands that to the UI. The split is enforced rather than
conventional — `lib/catalogue.ts` and `lib/prisma.ts` both `import "server-only"`,
so a client component that reaches for them fails the build instead of shipping
a database driver to a browser. `lib/products.ts` stays free of both Prisma and
I/O precisely so client components can import its types and labels.

Two decisions carry through the schema:

- **Prices are `Decimal(10,2)`.** Nothing stores currency as a float. The
  conversion to integer cents happens once, in `toCents`, so no arithmetic
  downstream can introduce rounding error.
- **Availability is derived, never stored.** There is no `inStock` column,
  because it would be a second source of truth free to disagree with the variant
  quantities it summarises. `totalStock` and `stockState` sum the variants on
  every read.

A product with no size run — the cap, the tote — still gets a real inventory
row. Its variant stores the key `std` rather than a size, and because that key
is never null, `(productId, sizeKey)` can carry a genuine unique constraint
(Postgres treats NULLs as distinct from one another, so a nullable size could
not). The storefront recognises a single-variant product and renders no size
selector at all, so no invented "One Size" is ever shown to a customer, and the
key itself never leaves the database — a cart line for one of these stores
`"size": null`.

### Rendering

`/products/[slug]` is prerendered per slug and revalidated every minute, which
keeps stock counts close to correct while still serving HTML rather than waiting
on a query. The homepage revalidates every five minutes. `/shop` is dynamic
because its filtering lives in the URL. Both mean `DATABASE_URL` must be
reachable at build time. `/cart` is static: the bag lives in the customer's
browser, so there is nothing for the server to render or query.

Prerendering has one sharp edge worth recording, because it is invisible on a
case-sensitive filesystem and quietly destructive on a case-insensitive one. A
build writes one artifact per slug, so on Windows a request for
`/products/ESSENTIAL-TEE` resolves straight to the prerendered
`essential-tee.html` and is answered with the product and a 200 — the slug guard
in `lib/catalogue.ts` never runs, and the not-found render that follows
overwrites the cached page for the real slug, which then 404s until the build is
discarded. `proxy.ts` closes that gap by redirecting any case variant to
its canonical lowercase form before routing, so a variant can never reach a
prerendered artifact. Slugs that differ by more than case have no artifact to
collide with and 404 through `notFound()` as normal.

### The seed

`npm run db:seed` is safe to run repeatedly. Products are upserted by slug,
variants by SKU, images by product and position, and anything a previous run
created that the seed no longer lists is removed — so it converges rather than
duplicating. It only ever touches the products it defines, and it never rewrites
`createdAt`, which is what "newest" sorts on.

## Product imagery

`components/product/product-art.tsx` draws each garment as a technical flat,
rendered at two crops so cards can cross-fade on hover. It is a deliberate
placeholder.

The schema is already built for the day photography arrives: `ProductImage` is a
table, not a column, carrying a nullable `url`, required `alt` text, a backdrop
tone and a sort position, and the storefront reads `alt` and `tone` from it
today. Adding photography means populating `url` and teaching `ProductArt` to
prefer it — no consumer changes.

## Design system

Tokens live in `app/globals.css` under `@theme`. The palette is warm and
low-chroma — ink, ash, stone, sand, bone — with brass as the only accent and clay
reserved for validation errors. Motion uses a single easing curve and respects
`prefers-reduced-motion`. Scroll reveals are gated behind a `js` class set before
first paint, so content stays visible when scripting is unavailable.
# aurel-and-ash
