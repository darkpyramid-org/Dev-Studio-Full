import { createServer } from "http";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import "dotenv/config";
import { attachPresenceWS } from "./presentation/ws/presence.handler.js";
import {
  corsOptions,
  helmetOptions,
  morganLogger,
  compressionMiddleware,
  noCacheMiddleware,
  globalLimiter,
} from "./presentation/config/index.js";
import { registerRoutes } from "./presentation/routes.js";
import { setupGooglePassport } from "./presentation/controllers/auth.controller.js";
import { requestIdMiddleware } from "./presentation/middleware/request-id.js";
import { logger } from "./infrastructure/lib/logger.js";
import { setupSwagger } from "./presentation/docs/swagger.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./presentation/middleware/error.js";

import { pool } from "./infrastructure/database/index.js";
import { ensureDatabaseTables } from "./infrastructure/database/schema-init.js";

// On Vercel, seeding is handled by the CI db-migrate job (drizzle-kit push).
// Lazy-importing seed avoids loading all seed data on every serverless cold-start.
const isVercel = Boolean(process.env.VERCEL);

const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT || 5000);

const app = express();

let schemaEnsured = false;
let schemaInitPromise: Promise<void> | null = null;

async function checkSchemaOnDemand() {
  if (schemaEnsured) return;
  if (!schemaInitPromise) {
    schemaInitPromise = ensureDatabaseTables(pool)
      .then(() => {
        schemaEnsured = true;
      })
      .finally(() => {
        schemaInitPromise = null;
      });
  }
  await schemaInitPromise;
}

// Trust proxy (nginx, load balancer, etc.) so rate-limit and IP detection work correctly
app.set("trust proxy", 1);

// --- Request tracing ---
app.use(requestIdMiddleware);

// --- Security & HTTP Hardening ---
app.use(helmetOptions);
app.use(corsOptions);
app.use(globalLimiter); // Apply rate limiting
app.use(morganLogger);

// --- Dev: disable caching ---
if (!isProd) {
  app.use(noCacheMiddleware);
}

// --- Body & response middleware ---
app.use(compressionMiddleware);
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

// --- Auto-ensure DB tables exist for API requests ---
app.use(async (req, _res, next) => {
  if (req.path.startsWith("/api/")) {
    try {
      await checkSchemaOnDemand();
    } catch (err) {
      logger.warn(`[db] On-demand schema initialization warning: ${(err as Error)?.message || String(err)}`);
    }
  }
  next();
});

// --- Auth ---
app.use(passport.initialize());
setupGooglePassport();

// --- Docs & Routes ---
setupSwagger(app);
registerRoutes(app);

// --- Admin Migration endpoint ---
app.all("/api/admin/migrate", async (_req: Request, res: Response) => {
  try {
    schemaEnsured = false;
    await checkSchemaOnDemand();
    const tablesResult = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
    );
    res.json({
      success: true,
      tablesCount: tablesResult.rows.length,
      tables: tablesResult.rows.map((r: { table_name: string }) => r.table_name),
    });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: (err as Error)?.message || String(err) });
  }
});

// --- Health Check handler ---
app.get("/api/health", async (_req: Request, res: Response) => {
  try {
    const isDbConfigured = Boolean(
      process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        process.env.POSTGRES_PRISMA_URL ||
        process.env.POSTGRES_URL_NON_POOLING,
    );

    let dbStatus = "not_configured";
    let dbError: string | null = null;
    let tables: string[] = [];

    if (isDbConfigured) {
      try {
        await pool.query("SELECT 1");
        dbStatus = "connected";
        await checkSchemaOnDemand();

        const tablesResult = await pool.query(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
        );
        tables = tablesResult.rows.map((r: { table_name: string }) => r.table_name);
      } catch (err: unknown) {
        dbStatus = "error";
        dbError = (err as Error)?.message || String(err);
      }
    }

    const statusCode = dbStatus === "connected" ? 200 : 503;
    res.status(statusCode).json({
      status: dbStatus === "connected" ? "ok" : "degraded",
      database: {
        configured: isDbConfigured,
        status: dbStatus,
        tablesCount: tables.length,
        hasAuthTable: tables.includes("auth_users"),
        tables,
        ...(dbError ? { error: dbError } : {}),
      },
      env: process.env.NODE_ENV ?? "development",
      isVercel,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    res.status(500).json({ status: "error", error: (err as Error)?.message || String(err) });
  }
});

// --- Root handler ---
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: isProd
      ? "Dev Studio API is running"
      : "Dev Studio API is running (Dev)",
  });
});

// --- 404 & Global Error Handling (must be last) ---
app.use(notFoundHandler);
app.use(globalErrorHandler);

async function startServer() {
  // Skip seeding on Vercel — the CI db-migrate job runs drizzle-kit push before
  // each deployment, ensuring tables exist without blocking every cold-start.
  // Without this guard, every Vercel cold-start tries to connect to the DB for
  // seeding, waits up to 10 s on a missing DATABASE_URL, and returns 500 errors.
  if (!isVercel) {
    try {
      const { runSeeding } = await import("./infrastructure/database/seed.js");
      logger.info("Checking and seeding database...");
      await runSeeding();
      logger.info("Seeding check complete.");
    } catch (err) {
      logger.error("Database seeding failed on startup", { err });
    }
  }

  // Only start the HTTP listener when not running on Vercel
  if (!isVercel) {
    const httpServer = createServer(app);
    attachPresenceWS(httpServer);

    httpServer.listen(PORT, "0.0.0.0", () => {
      logger.info(`Dev Studio running on port ${PORT}`, {
        port: PORT,
        env: process.env.NODE_ENV ?? "development",
      });
    });
  }
}

startServer();

export default app;
