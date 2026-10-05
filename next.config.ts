import type { NextConfig } from "next";

/**
 * Build-time prerendering parallelism.
 *
 * Left unset, Next renders static pages with one worker per CPU, and every
 * worker that touches a product opens its own Prisma pool. A machine with many
 * cores therefore asks the database for many concurrent connections at once,
 * which is more than a small or free-tier PostgreSQL will hand out — the
 * surplus connections get refused or reset, and the build dies partway through
 * generating pages.
 *
 * Default to two workers so builds stay gentle against Prisma Postgres pooled
 * connections. Override NEXT_BUILD_CPUS upward only when the database has enough
 * connection headroom for the resulting burst. Pairing it with
 * DATABASE_POOL_SIZE lowers the burst from both ends.
 */
const buildCpus = (() => {
  const configured = Number.parseInt(process.env.NEXT_BUILD_CPUS ?? "", 10);
  return Number.isInteger(configured) && configured > 0 ? configured : 2;
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: { cpus: buildCpus },
};

export default nextConfig;
