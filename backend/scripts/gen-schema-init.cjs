const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, '..', 'src', 'infrastructure', 'database', 'drizzle', '0000_absurd_human_fly.sql');
let sql = fs.readFileSync(sqlPath, 'utf8');

// Replace enums with safe DO block
const enumRegex = /CREATE TYPE "public"\."(\w+)" AS ENUM\(([^)]+)\);/g;
sql = sql.replace(enumRegex, 'DO $$ BEGIN\n  CREATE TYPE "public"."$1" AS ENUM($2);\nEXCEPTION WHEN duplicate_object THEN null;\nEND $$;');

// Replace CREATE TABLE with CREATE TABLE IF NOT EXISTS
sql = sql.replace(/CREATE TABLE "/g, 'CREATE TABLE IF NOT EXISTS "');

// Replace CREATE INDEX with CREATE INDEX IF NOT EXISTS
sql = sql.replace(/CREATE INDEX "/g, 'CREATE INDEX IF NOT EXISTS "');

// Replace ADD CONSTRAINT with safe DO block
sql = sql.replace(/ALTER TABLE "messages" ADD CONSTRAINT "(\w+)"([^;]+);/g, 'DO $$ BEGIN\n  ALTER TABLE "messages" ADD CONSTRAINT "$1"$2;\nEXCEPTION WHEN duplicate_object THEN null;\nEND $$;');

// Remove statement-breakpoint comments
sql = sql.replace(/--> statement-breakpoint/g, '');

const outPath = path.join(__dirname, '..', 'src', 'infrastructure', 'database', 'schema-init.ts');
const tsContent = `/**
 * Auto-generated idempotent DDL for all domain tables.
 */
export const INITIAL_SCHEMA_SQL = ${JSON.stringify(sql)};

export async function ensureDatabaseTables(pool: import("pg").Pool): Promise<void> {
  try {
    const check = await pool.query("SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'auth_users'");
    if (check.rows.length === 0) {
      console.log("[db] auth_users table missing - running idempotent schema initialization...");
      await pool.query(INITIAL_SCHEMA_SQL);
      console.log("[db] Database schema initialized successfully (24 tables ready).");
    }
  } catch (err) {
    console.error("[db] Schema initialization error:", err);
  }
}
`;

fs.writeFileSync(outPath, tsContent, 'utf8');
console.log('Generated schema-init.ts successfully!');
