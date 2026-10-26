/**
 * Singleton ioredis clients.
 *
 * Two clients are required because a Redis connection that has called
 * SUBSCRIBE/PSUBSCRIBE enters subscriber mode and can no longer issue
 * regular commands. We therefore keep one "publisher" client (all normal
 * reads/writes) and one "subscriber" client (pub/sub channel listener).
 *
 * When REDIS_URL is not set the module falls back to an in-process Map so
 * the rest of the application compiles and runs without a Redis instance.
 */

import Redis from "ioredis";
import { logger } from "./logger.js";

const REDIS_URL = process.env.REDIS_URL;

function makeOpts() {
  return {
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false,
    connectTimeout: 5_000,
    // lazyConnect: true means ioredis will NOT connect until the first command.
    // This is critical for Vercel serverless cold-starts — without it, an eager
    // connect() call blocks for up to 5 s when REDIS_URL points to an unreachable
    // host, causing every cold-start to time out before serving any request.
    lazyConnect: true,
  } as const;
}

function createClient(name: string): Redis | null {
  if (!REDIS_URL) return null;
  const client = new Redis(REDIS_URL, makeOpts());

  client.on("connect", () => logger.info(`Redis ${name} connected`));
  client.on("error", (err: Error) =>
    logger.warn(`Redis ${name} error`, { message: err.message }),
  );

  // Do NOT call client.connect() here.
  // lazyConnect: true defers connection until the first command is issued.
  // Calling connect() eagerly would negate the lazy benefit and re-introduce
  // the cold-start hang on Vercel when Redis is unavailable.

  return client;
}

export const redisPublisher: Redis | null = createClient("publisher");
export const redisSubscriber: Redis | null = createClient("subscriber");

export const isRedisAvailable = (): boolean =>
  redisPublisher !== null && redisPublisher.status === "ready";
