/**
 * Storage adapter between the legacy `Connector` store and the `Platform`
 * domain type.
 *
 * This module is the SINGLE place that knows the legacy encoding:
 *   - `email`  → site URL
 *   - `phone`  → commission
 *   - `notes`  → JSON blob with description/bestFor/specialties/status/…
 *   - `category` → region name
 *
 * All other platform code consumes the clean `Platform` domain type.
 */

import type { Connector } from "@/types/tools";
import type { Platform, PlatformRegion, PlatformRegionCode } from "@/types/platforms";
import { PRESET_PLATFORMS } from "@/constants/platforms-presets";

const REGION_BY_CODE: Record<PlatformRegionCode, PlatformRegion> = {
  global: "Global",
  eg: "Egypt",
  sa: "Saudi Arabia",
};

export type { Platform } from "@/types/platforms";

/**
 * Decode a stored connector into the `Platform` domain type.
 *
 * Region resolution uses explicit precedence (lowest → highest priority):
 *   1. `category` string  — fuzzy fallback, least authoritative
 *   2. JSON notes blob    — explicitly saved user value
 *   3. Preset match       — curated ground-truth data
 * Each step only overrides the previous one, so a user-edited region is
 * never silently clobbered by a weaker signal.
 */
export function parsePlatformConnector(c: Connector): Platform {
  let description = "";
  let bestFor = "";
  let specialties: string[] = [];
  let myProfileUrl = "";
  let status: Platform["status"] = "active";
  let arabicName = "";
  let commission = c.phone || "Standard Commission";
  let url = c.email || "";

  // ── 1. Category string (least authoritative) ──
  let regionCode: PlatformRegionCode = "global";
  const cat = (c.category || "").toLowerCase();
  if (cat.includes("saudi") || cat.includes("sa")) {
    regionCode = "sa";
  } else if (cat.includes("egypt") || cat.includes("eg")) {
    regionCode = "eg";
  }

  // ── 2. JSON notes blob (explicit user-saved value) ──
  if (c.notes) {
    const trimmed = c.notes.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.description) description = parsed.description;
        if (parsed.bestFor) bestFor = parsed.bestFor;
        if (Array.isArray(parsed.specialties)) specialties = parsed.specialties;
        if (parsed.myProfileUrl) myProfileUrl = parsed.myProfileUrl;
        if (parsed.status) status = parsed.status;
        if (parsed.arabicName) arabicName = parsed.arabicName;
        if (parsed.url) url = parsed.url;
        if (parsed.commission) commission = parsed.commission;
        // Overrides the category-derived value above.
        if (parsed.regionCode === "global" || parsed.regionCode === "eg" || parsed.regionCode === "sa") {
          regionCode = parsed.regionCode;
        }
      } catch {
        // Not JSON — fall back to plain text below
      }
    } else {
      description = c.notes;
    }
  }

  // ── 3. Preset match (ground truth — highest priority) ──
  const preset = PRESET_PLATFORMS.find(
    (p) =>
      p.name.toLowerCase() === (c.name || "").toLowerCase() ||
      (c.name || "").toLowerCase().includes(p.id) ||
      (p.arabicName && (c.name || "").includes(p.arabicName.split(" ")[0])),
  );

  if (preset) {
    if (!url) url = preset.url;
    if (!description) description = preset.description;
    if (!bestFor) bestFor = preset.bestFor;
    if (!specialties.length) specialties = [...preset.specialties];
    if (!commission || commission === "Standard Commission") commission = preset.commission;
    if (!arabicName && preset.arabicName) arabicName = preset.arabicName;
    regionCode = preset.regionCode;
  }

  return {
    id: c.id,
    name: c.name || "Untitled Platform",
    arabicName,
    region: REGION_BY_CODE[regionCode],
    regionCode,
    url: url || "https://",
    myProfileUrl,
    commission: commission || "Standard terms",
    description: description || "Freelance marketplace and talent contracting hub.",
    bestFor: bestFor || "Freelance projects & client inquiries",
    specialties: specialties.length > 0 ? specialties : ["Web Development", "Design"],
    tags: Array.isArray(c.tags) && c.tags.length > 0 ? c.tags : ["Freelance", "Marketplace"],
    status,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt || Date.now(),
  };
}

/**
 * Encode a `Platform` back into the legacy `Connector` storage shape.
 */
export function serializePlatformConnector(
  platform: Platform,
  existingCreatedAt?: number,
): Connector {
  const notesPayload = JSON.stringify({
    description: platform.description,
    bestFor: platform.bestFor,
    specialties: platform.specialties,
    myProfileUrl: platform.myProfileUrl,
    status: platform.status,
    arabicName: platform.arabicName,
    regionCode: platform.regionCode,
    url: platform.url,
    commission: platform.commission,
  });

  return {
    id: platform.id,
    type: "platforms",
    name: platform.name,
    category: platform.region,
    email: platform.url, // store site URL in email field
    phone: platform.commission, // store commission info in phone field
    notes: notesPayload,
    tags: platform.tags,
    createdAt: existingCreatedAt || platform.createdAt || Date.now(),
    updatedAt: Date.now(),
  };
}

export function getPlatformFlag(regionCode: string): string {
  switch (regionCode) {
    case "sa":
      return "SA";
    case "eg":
      return "EG";
    default:
      return "GL";
  }
}
