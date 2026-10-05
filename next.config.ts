import type { NextConfig } from "next";

/**
 * Build-time prerendering parallelism.
 *
 * Left unset, Next renders static pages with one worker per CPU, and every
 * worker that touches a product opens its own Prisma pool. That burst is fine
 * against a hosted PostgreSQL, but the local `prisma dev` server used for
 * development tops out around ten concurrent connections and resets anything
 * beyond it, which takes the build down partway through generating pages.
 *
 * Set NEXT_BUILD_CPUS=2 to render more gently against such a database. It is an
 * escape hatch for constrained environments, not a setting production needs —
 * deployed against a normal Postgres, leaving it unset is correct.
 */
const buildCpus = Number.parseInt(process.env.NEXT_BUILD_CPUS ?? "", 10);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(Number.isInteger(buildCpus) && buildCpus > 0 ? { experimental: { cpus: buildCpus } } : {}),
};

export default nextConfig;