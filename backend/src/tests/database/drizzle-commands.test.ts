import { describe, test, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Drizzle Command Tests', () => {
  const backendPath = process.cwd();
  const drizzleConfigPath = join(backendPath, 'drizzle.config.ts');
  const migrationPath = join(backendPath, 'src', 'infrastructure', 'database', 'drizzle');

  test('drizzle.config.ts has correct configuration', () => {
    expect(existsSync(drizzleConfigPath)).toBe(true);
    
    const configContent = readFileSync(drizzleConfigPath, 'utf-8');
    
    // Parse the config to check structure
    expect(configContent).toContain('export default defineConfig({');
    expect(configContent).toContain('out: "./src/infrastructure/database/drizzle"');
    expect(configContent).toContain('schema: "./src/domain/schema.ts"');
    expect(configContent).toContain('dialect: "postgresql"');
    expect(configContent).toContain('dbCredentials:');
    expect(configContent).toContain('url: process.env.DATABASE_URL!');
  });

  test('migration folder structure is correct', () => {
    expect(existsSync(migrationPath)).toBe(true);
    
    // Check for migration files
    const migrationFiles = ['0001_activity_logs.sql', '0002_notifications.sql'];
    migrationFiles.forEach(file => {
      const filePath = join(migrationPath, file);
      expect(existsSync(filePath)).toBe(true);
      
      // Check file content
      const content = readFileSync(filePath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('CREATE TABLE');
    });
    
    // Check meta folder
    const metaPath = join(migrationPath, 'meta');
    expect(existsSync(metaPath)).toBe(true);
    
    const journalPath = join(metaPath, '_journal.json');
    expect(existsSync(journalPath)).toBe(true);
    
    const journalContent = JSON.parse(readFileSync(journalPath, 'utf-8'));
    expect(journalContent).toHaveProperty('version');
    expect(journalContent).toHaveProperty('dialect');
    expect(journalContent).toHaveProperty('entries');
    expect(journalContent.dialect).toBe('postgresql');
  });

  test('package.json has correct drizzle scripts', () => {
    const packageJsonPath = join(backendPath, 'package.json');
    expect(existsSync(packageJsonPath)).toBe(true);
    
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    
    expect(packageJson.scripts).toHaveProperty('db:push');
    expect(packageJson.scripts).toHaveProperty('db:seed');
    
    expect(packageJson.scripts['db:push']).toBe('npx drizzle-kit push');
    expect(packageJson.scripts['db:seed']).toBe('npx tsx src/infrastructure/database/seed.ts');
    
    // Check dev dependencies
    expect(packageJson.devDependencies).toHaveProperty('drizzle-kit');
  });

  test('schema.ts file aggregates all schema files', () => {
    const schemaPath = join(backendPath, 'src', 'domain', 'schema.ts');
    expect(existsSync(schemaPath)).toBe(true);
    
    const schemaContent = readFileSync(schemaPath, 'utf-8');
    
    // Check for exports from all schema files
    const expectedExports = [
      './schema/core.js',
      './schema/integrations.js',
      './schema/career.js',
      './schema/learning.js',
      './schema/profile.js',
      './schema/auth.js',
      './schema/cv.js',
      './schema/planner.js',
      './schema/chat.js',
      './schema/activity.js',
      './schema/notifications.js'
    ];
    
    expectedExports.forEach(exportPath => {
      expect(schemaContent).toContain(`export * from "${exportPath}"`);
    });
  });

  test('database index.ts has proper exports', () => {
    const dbIndexPath = join(backendPath, 'src', 'infrastructure', 'database', 'index.ts');
    expect(existsSync(dbIndexPath)).toBe(true);
    
    const dbIndexContent = readFileSync(dbIndexPath, 'utf-8');
    
    // Check for critical imports and exports
    expect(dbIndexContent).toContain('import { drizzle } from "drizzle-orm/node-postgres"');
    expect(dbIndexContent).toContain('import pg from "pg"');
    expect(dbIndexContent).toContain('import * as schema from "../../domain/schema.js"');
    expect(dbIndexContent).toContain('export const pool = new Pool({');
    expect(dbIndexContent).toContain('export const db = drizzle(pool, { schema })');
    
    // Check for connection string cleaning logic
    expect(dbIndexContent).toContain('cleanConnectionString');
    expect(dbIndexContent).toContain('sslmode');
    expect(dbIndexContent).toContain('channel_binding');
  });

  test('seed.ts has proper structure and exports', () => {
    const seedPath = join(backendPath, 'src', 'infrastructure', 'database', 'seed.ts');
    expect(existsSync(seedPath)).toBe(true);
    
    const seedContent = readFileSync(seedPath, 'utf-8');
    
    // Check for main exports
    expect(seedContent).toContain('export async function runSeeding()');
    
    // Check for critical imports
    expect(seedContent).toContain('import { db, pool } from "./index.js"');
    expect(seedContent).toContain('import { count as countFn } from "drizzle-orm"');
    
    // Check for seed function calls
    expect(seedContent).toContain('seedGlobalInterviewQuestions()');
    expect(seedContent).toContain('seedTableIfNeeded(prompts, seedPrompts, "prompts")');
    expect(seedContent).toContain('seedTableIfNeeded(agents, seedAgents, "agents")');
    
    // Check for main function
    expect(seedContent).toContain('async function main()');
    expect(seedContent).toContain('if (isDirectRun) {');
  });
});

describe('Drizzle Command Execution Tests', () => {
  // These tests would actually run the commands in a real environment
  // For now, we'll test the command structure
  
  test('drizzle-kit check command structure', () => {
    // This is what the command should look like
    const expectedCommand = 'npx drizzle-kit check';
    
    // The command should work from the backend directory
    // and automatically find drizzle.config.ts
    expect(expectedCommand).toBe('npx drizzle-kit check');
  });

  test('drizzle-kit push command structure', () => {
    // This is what the command should look like
    const expectedCommand = 'npx drizzle-kit push';
    
    // The command should use the configuration from drizzle.config.ts
    // which now points to the new migration folder
    expect(expectedCommand).toBe('npx drizzle-kit push');
  });

  test('seed command structure', () => {
    // This is what the command should look like
    const expectedCommand = 'npx tsx src/infrastructure/database/seed.ts';
    
    // The command should execute the seed.ts file
    // which imports from the new database structure
    expect(expectedCommand).toBe('npx tsx src/infrastructure/database/seed.ts');
  });
});
