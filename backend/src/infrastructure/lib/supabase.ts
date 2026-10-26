import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "./logger.js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || "";
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || "";

let clientInstance: SupabaseClient | null = null;
let adminInstance: SupabaseClient | null = null;

/**
 * Returns a Supabase client initialized with the publishable key.
 * Safe for client-facing/scoped operations.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabasePublishableKey) {
    logger.warn("Supabase URL or Publishable Key is not configured.");
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return clientInstance;
}

/**
 * Returns a Supabase admin client initialized with the secret key.
 * Has full elevated privileges (bypasses RLS). Keep server-side only.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseSecretKey) {
    logger.warn("Supabase URL or Secret Key is not configured.");
    return null;
  }
  if (!adminInstance) {
    adminInstance = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return adminInstance;
}

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && (supabasePublishableKey || supabaseSecretKey));
};
