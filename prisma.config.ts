import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Deliberately not `env("DATABASE_URL")`. This file is loaded by every
    // Prisma command, including `generate`, which never opens a connection —
    // so throwing here would make `npm install` fail on a fresh clone that has
    // no .env yet. Anything that actually connects still fails loudly: `lib/prisma.ts`
    // guards with an explicit message, and migrate/seed are rejected by Prisma
    // for an empty URL.
    url: process.env.DATABASE_URL ?? "",
  },
});