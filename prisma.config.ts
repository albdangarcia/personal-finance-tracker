import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // 1. Direct for migrations (Neon/Vercel) -> 2. Direct for local -> 3. Fallbacks
    url:
      env("DATABASE_URL_UNPOOLED") ??
      env("POSTGRES_URL_NON_POOLING") ??
      env("POSTGRES_URL") ??
      env("DATABASE_URL"),
  },
});