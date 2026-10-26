import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  "";

const requiresTls =
  url.includes("sslmode=require") ||
  url.includes("supabase") ||
  url.includes("neon");

export default defineConfig({
  out: "./src/infrastructure/database/drizzle",
  schema: "./src/domain/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
    ssl: requiresTls ? { rejectUnauthorized: false } : undefined,
  },
});
