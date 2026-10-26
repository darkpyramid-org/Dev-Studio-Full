/**
 * Centralized environment configuration helpers.
 *
 * Security-sensitive env vars must never fall back to hardcoded values.
 * A hardcoded JWT secret would allow anyone with access to the source to
 * forge valid tokens and impersonate any user.
 */

const DEV_FALLBACK_SECRET = "dev-only-insecure-jwt-secret-do-not-use-in-production";

/**
 * Resolve the JWT signing secret.
 *
 * - Production: throws at startup when JWT_SECRET is missing — fail fast
 *   instead of silently running with a publicly known secret.
 * - Development/test: falls back to an obviously insecure dev-only secret
 *   so local runs and test suites keep working without extra setup.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("[config] JWT_SECRET env var is required in production");
  }

  console.warn(
    "[config] JWT_SECRET is not set — using an insecure development-only secret. " +
      "Set JWT_SECRET before deploying.",
  );
  return DEV_FALLBACK_SECRET;
}
