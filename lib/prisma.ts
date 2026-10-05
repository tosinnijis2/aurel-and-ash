import "server-only";

import type { PrismaClient } from "@prisma/client";
import { createPrismaClient } from "@/lib/db";

/**
 * The single Prisma client for the application.
 *
 * `server-only` is what keeps this out of the browser bundle: if a client
 * component ever reaches it through an import chain, the build fails loudly
 * instead of quietly shipping a database driver to a visitor.
 *
 * Development hot reloads re-evaluate modules on every edit. Without the
 * globalThis cache, each evaluation would build a fresh client and its own
 * connection pool until the server exhausted the database's connection limit.
 * In production the module is evaluated once and the cache is skipped.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}