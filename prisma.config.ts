import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Use process.env for the optional direct URL, env() for the required runtime URL
    url:
      process.env.DATABASE_URL_UNPOOLED ??
      env("DATABASE_URL"),
  },
});
