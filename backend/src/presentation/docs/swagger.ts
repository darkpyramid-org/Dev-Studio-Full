import { createRequire } from "module";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const require = createRequire(import.meta.url);
let swaggerSpec: Record<string, unknown> = { openapi: "3.0.0", info: { title: "Dev Studio API", version: "1.0.0" }, paths: {} };
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  swaggerSpec = require("./swagger-spec.json") as Record<string, unknown>;
} catch (err) {
  console.warn("[swagger] Warning: Could not load swagger-spec.json, using fallback", err);
}

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/swagger", (_req, res) => res.redirect("/api-docs"));
  app.get("/docs", (_req, res) => res.redirect("/api-docs"));
  app.get("/swagger.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}



