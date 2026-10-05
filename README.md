# AUREL & ASH

Direct-to-consumer storefront for a fictional lifestyle brand. Next.js App Router,
TypeScript, Tailwind CSS v4, Prisma and PostgreSQL.

**Designed for the everyday.**

## Getting started

```bash
npm install
cp .env.example .env          # then set DATABASE_URL
npm run db:deploy             # create the schema
npm run db:seed               # load the catalogue
npm run dev                   # http://localhost:3000
```

`DATABASE_URL` must be a direct `postgresql://` connection string. The app
reaches the database through Prisma's `pg` driver adapter, so a Prisma proxy
URL will not work. On a hosted provider, use the *pooled* string they issue
(`?pgbouncer=true&connection_limit=1`) — a serverless function needs it so
concurrent invocations do not exhaust the database's connection limit.

### A local PostgreSQL

No PostgreSQL on the machine? `npm run db:start` launches Prisma's embedded
Postgres dev server and prints the connection string to paste into `.env`. It
is real PostgreSQL, not SQLite.

One caveat worth knowing: that server tolerates only about ten concurrent
connections and starts terminating the rest, which is well short of what
`next build` asks for when it renders pages in parallel across workers. Building
against it wants both of these turned down:

```bash
NEXT_BUILD_CPUS=2 DATABASE_POOL_SIZE=2 npm run build
```

Drop both once you are on a normal database.

| Script              | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Development server                          |
| `npm run build`     | Generate the client, then production build  |
| `npm run start`     | Serve the production build                  |
| `npm run lint`      | ESLint                                      |
| `npm run typecheck` | `tsc --noEmit`                              |
| `npm run db:start`  | Start a local Prisma Postgres dev server    |
| `npm run db:migrate`| Create and apply a migration in development |
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
  products.ts           catalogue types, constants and pure helpers
  catalogue.ts          server-only: the Prisma-backed queries
  prisma.ts             server-only: the shared client, cached across hot reloads
  db.ts                 client construction, shared with the seed script
  format.ts             currency formatting
  forms.ts              shared form state shapes
prisma/
  schema.prisma         Product, ProductVariant, ProductImage
  seed.ts               idempotent catalogue seed
  migrations/           generated SQL, applied by db:migrate / db:deploy
middleware.ts           redirects case-variant product slugs to their canonical form
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
selector at all, so no invented "One Size" is ever shown to a customer.

### Rendering

`/products/[slug]` is prerendered per slug and revalidated every minute, which
keeps stock counts close to correct while still serving HTML rather than waiting
on a query. The homepage revalidates every five minutes. `/shop` is dynamic
because its filtering lives in the URL. Both mean `DATABASE_URL` must be
reachable at build time.

Prerendering has one sharp edge worth recording, because it is invisible on a
case-sensitive filesystem and quietly destructive on a case-insensitive one. A
build writes one artifact per slug, so on Windows a request for
`/products/ESSENTIAL-TEE` resolves straight to the prerendered
`essential-tee.html` and is answered with the product and a 200 — the slug guard
in `lib/catalogue.ts` never runs, and the not-found render that follows
overwrites the cached page for the real slug, which then 404s until the build is
discarded. `middleware.ts` closes that gap by redirecting any case variant to
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