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

// Clean connection string properly without breaking URL structure or database name
function cleanConnectionString(raw: string): string {
  try {
    const url = new URL(raw);
    url.searchParams.delete("sslmode");
    url.searchParams.delete("channel_binding");
    return url.toString();
  } catch {
    return raw
      .replace(/(\?|&)sslmode=[^&]*/g, "")
      .replace(/(\?|&)channel_binding=[^&]*/g, "")
      .replace(/\?&/, "?")
      .replace(/\?$/, "");
  }
}

const rawUrl = configuredUrl || "postgres://localhost:5432/placeholder";
const connectionString = cleanConnectionString(rawUrl);

if (!configuredUrl) {
  console.warn(
    "\x1b[33m%s\x1b[0m",
    "WARNING: No database URL is set. Configure DATABASE_URL or POSTGRES_URL.",
  );
}

const requiresTls =
  rawUrl.includes("sslmode=require") ||
  rawUrl.includes("neon.tech") ||
  rawUrl.includes("supabase.") ||
  rawUrl.includes("pooler.supabase.com");

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 10000,
  // Managed PostgreSQL providers require TLS. Preserve sslmode=require semantics
  // after stripping that parameter to avoid node-postgres connection warnings.
  ssl: requiresTls ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });
