import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma configuration.
 *
 * `DATABASE_URL` is the pooled Prisma Postgres connection used by the app at
 * runtime through `@prisma/adapter-pg`.
 *
 * `DIRECT_URL` is the direct Prisma Postgres connection used by Prisma CLI
 * commands that need to talk to the database directly, including migrations,
 * introspection and Studio. Keeping CLI work on the direct URL avoids running
 * migrations through the pooled runtime endpoint.
 *
 * `SHADOW_DATABASE_URL` is optional and used by exactly one command. See the note
 * on `shadowDatabaseUrl` below.
 */

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),

    /**
     * Only `migrate dev` uses this, and only when it is set.
     *
     * To prove that the committed migrations produce the schema the files
     * claim, `migrate dev` replays them against a throwaway copy of the
     * database. It creates and drops that copy itself, which needs a role with
     * CREATE DATABASE — hosted providers commonly withhold exactly that, and the
     * command then fails before it does anything useful.
     *
     * Point this at a scratch database you are willing to see dropped and
     * recreated. Prisma resets it freely; never point it at a database holding
     * anything you care about.
     *
     * `migrate deploy` — the production and CI path — never reads it. That
     * command applies the committed migrations to the real database and does
     * nothing else, which is why it needs no elevated privileges.
     */
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
