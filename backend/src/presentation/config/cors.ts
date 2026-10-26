import cors from "cors";

const isProd = process.env.NODE_ENV === "production";

// Collect explicit origins from env and hardcoded production URLs
const explicitOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  // Canonical production frontend URL
  "https://ms-dev-studio.vercel.app",
  // Any custom frontend URL set in Vercel env vars
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

export const corsOptions = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (same-domain Vercel rewrites, server-to-server, curl)
    if (!origin) return callback(null, true);

    // Always allow in development
    if (!isProd) return callback(null, true);

    // Allow explicit origins
    if (explicitOrigins.includes(origin)) return callback(null, true);

    // Allow all Vercel preview/deployment URLs for this project
    // e.g. ms-dev-studio-abc123-org.vercel.app, ms-dev-studio.vercel.app
    if (/^https:\/\/ms-dev-studio[a-z0-9-]*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // Allow the whole *.vercel.app domain for org previews if ALLOW_VERCEL_PREVIEWS is set
    if (process.env.ALLOW_VERCEL_PREVIEWS === "true" && origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  // Ensure pre-flight OPTIONS requests are handled correctly
  preflightContinue: false,
  optionsSuccessStatus: 204,
});
