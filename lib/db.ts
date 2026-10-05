import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Upper bound on connections in a single client.
 *
 * Small on purpose. `pg` opens ten connections per pool by default, and the
 * total is (number of clients x this number): every build worker and every
 * serverless instance gets its own. Prerendering a build with a dozen workers at
 * a large per-client pool therefore asks a hosted PostgreSQL for far more
 * connections than a small database will hand out, and the build dies on
 * "Server has closed the connection" partway through generating pages.
 *
 * Override with DATABASE_POOL_SIZE against a database with a different ceiling.
 * The default stays conservative for Prisma Postgres and serverless hosts,
 * where the provider counts every connection across all instances.
 */
const POOL_SIZE = (() => {
  const configured = Number.parseInt(process.env.DATABASE_POOL_SIZE ?? "", 10);
  return Number.isInteger(configured) && configured > 0 ? configured : 2;
})();

/**
 * Builds a Prisma client pointed at `DATABASE_URL`.
 *
 * Kept separate from `lib/prisma.ts` because this module has to be importable
 * outside a React server render — the seed runs under plain Node, where
 * `server-only` deliberately throws. The singleton and its hot-reload cache
 * live in the guarded module; only the construction is shared.
 */
export function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and point it at a PostgreSQL database.",
    );
  }

  const normalizedConnectionString = normalizePostgresConnectionString(connectionString);

  // Prisma's query compiler reaches Postgres through the driver adapter rather
  // than its own binary protocol client, which is what lets the same code run
  // on a Node server, on Vercel functions and at build time during prerendering.
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: normalizedConnectionString, max: POOL_SIZE }),
  });
}

function normalizePostgresConnectionString(connectionString: string): string {
  const url = new URL(connectionString);

  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    return connectionString;
  }

  const sslMode = url.searchParams.get("sslmode");

  if (sslMode && ["prefer", "require", "verify-ca"].includes(sslMode)) {
    url.searchParams.set("sslmode", "verify-full");
    return url.toString();
  }

  return connectionString;
}
