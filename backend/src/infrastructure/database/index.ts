import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../../domain/schema.js";

const { Pool } = pg;

// Support the standard DATABASE_URL plus Vercel's Supabase/Postgres variable names.
const configuredUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

// Use a placeholder URL if no database URL is configured to prevent startup crashes.
// Database operations will fail at runtime if the connection is actually attempted.
// We strip out sslmode and channel_binding query parameters to suppress libpq warnings from pg.
const rawUrl = configuredUrl || "postgres://localhost:5432/placeholder";
const connectionString = rawUrl
  .replace(/(\?|&)sslmode=require/g, "")
  .replace(/(\?|&)channel_binding=require/g, "")
  .replace(/\?$/, "");

if (!configuredUrl) {
  console.warn(
    "\x1b[33m%s\x1b[0m",
    "WARNING: No database URL is set. Configure DATABASE_URL or POSTGRES_URL.",
  );
}

const requiresTls =
  rawUrl.includes("sslmode=require") ||
  rawUrl.includes("neon.tech") ||
  rawUrl.includes("supabase.");

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 5000,
  // Managed PostgreSQL providers require TLS. Preserve sslmode=require semantics
  // after stripping that parameter to avoid node-postgres connection warnings.
  ssl: requiresTls ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });
