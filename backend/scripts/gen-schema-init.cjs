const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, '..', 'src', 'infrastructure', 'database', 'drizzle', '0000_absurd_human_fly.sql');
let sql = fs.readFileSync(sqlPath, 'utf8');

// Replace enums using function to preserve $$
const enumRegex = /CREATE TYPE "public"\."(\w+)" AS ENUM\(([^)]+)\);/g;
sql = sql.replace(enumRegex, (_, name, values) => {
  return `DO $$ BEGIN\n  CREATE TYPE "public"."${name}" AS ENUM(${values});\nEXCEPTION WHEN duplicate_object THEN null;\nEND $$;`;
});

// Replace CREATE TABLE with CREATE TABLE IF NOT EXISTS
sql = sql.replace(/CREATE TABLE "/g, 'CREATE TABLE IF NOT EXISTS "');

// Replace CREATE INDEX with CREATE INDEX IF NOT EXISTS
sql = sql.replace(/CREATE INDEX "/g, 'CREATE INDEX IF NOT EXISTS "');

// Replace ADD CONSTRAINT using function to preserve $$
sql = sql.replace(/ALTER TABLE "messages" ADD CONSTRAINT "(\w+)"([^;]+);/g, (_, name, rest) => {
  return `DO $$ BEGIN\n  ALTER TABLE "messages" ADD CONSTRAINT "${name}"${rest};\nEXCEPTION WHEN duplicate_object THEN null;\nEND $$;`;
});

// Remove statement-breakpoint comments
sql = sql.replace(/--> statement-breakpoint/g, '');

const outPath = path.join(__dirname, '..', 'src', 'infrastructure', 'database', 'schema-init.ts');
const tsContent = `/**
 * Auto-generated idempotent DDL for all domain tables.
 */
export const INITIAL_SCHEMA_SQL = ${JSON.stringify(sql)};

export async function ensureDatabaseTables(pool: import("pg").Pool): Promise<{ created: boolean; tables: string[]; error?: string }> {
  try {
    const check = await pool.query("SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'auth_users'");
    if (check.rows.length === 0) {
      console.log("[db] auth_users table missing - running idempotent schema initialization...");
      await pool.query(INITIAL_SCHEMA_SQL);
      console.log("[db] Database schema initialized successfully (24 tables ready).");

      try {
        const { runSeeding } = await import("./seed.js");
        await runSeeding();
        console.log("[db] Default seed data initialized.");
      } catch (seedErr) {
        console.warn("[db] Seed data skipped/warning:", seedErr);
      }
    }
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    const tables = res.rows.map((r: { table_name: string }) => r.table_name);
    return { created: true, tables };
  } catch (err) {
    const msg = (err as Error)?.message || String(err);
    console.error("[db] Schema initialization error:", msg);
    return { created: false, tables: [], error: msg };
  }
}
`;

fs.writeFileSync(outPath, tsContent, 'utf8');
console.log('Regenerated schema-init.ts with seeds!');
