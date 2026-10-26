/**
 * Platform domain type.
 *
 * Platforms are freelance-marketplace sites (Fiverr, Mostaql, Upwork, …)
 * tracked in the catalog. This is the type all platform UI code works with.
 *
 * Storage note: platforms are persisted through the legacy `Connector`
 * store. The ONLY place that knows about that encoding is the adapter in
 * `features/connectors/platform-helpers.ts` (`parsePlatformConnector` /
 * `serializePlatformConnector`). Nothing outside that adapter may read or
 * write the encoded `Connector` fields (email = site URL, phone =
 * commission, notes = JSON blob).
 */

export type PlatformRegionCode = "global" | "eg" | "sa";
export type PlatformRegion = "Global" | "Egypt" | "Saudi Arabia";
export type PlatformStatus = "active" | "top_rated" | "applied" | "exploring";

export interface Platform {
  id: string;
  name: string;
  arabicName?: string;
  region: PlatformRegion;
  regionCode: PlatformRegionCode;
  url: string;
  myProfileUrl?: string;
  commission: string;
  description: string;
  bestFor: string;
  specialties: string[];
  tags: string[];
  status: PlatformStatus;
  rating?: number;
  createdAt?: number;
  updatedAt: number;
}
