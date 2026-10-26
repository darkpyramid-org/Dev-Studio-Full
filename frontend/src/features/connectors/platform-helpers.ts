import type { Connector } from "@/types/tools";
import { PRESET_PLATFORMS, type PlatformPreset } from "@/constants/platforms-presets";

export interface ParsedPlatform {
  id: string;
  name: string;
  arabicName?: string;
  region: "Global" | "Egypt" | "Saudi Arabia";
  regionCode: "global" | "eg" | "sa";
  url: string;
  myProfileUrl?: string;
  commission: string;
  description: string;
  bestFor: string;
  specialties: string[];
  tags: string[];
  status: "active" | "top_rated" | "applied" | "exploring";
  rating?: number;
  updatedAt: number;
}

export function parsePlatformConnector(c: Connector): ParsedPlatform {
  let description = "";
  let bestFor = "";
  let specialties: string[] = [];
  let myProfileUrl = "";
  let status: "active" | "top_rated" | "applied" | "exploring" = "active";
  let arabicName = "";
  let regionCode: "global" | "eg" | "sa" = "global";
  let commission = c.phone || "Standard Commission";
  let url = c.email || "";

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
        if (parsed.regionCode) regionCode = parsed.regionCode;
        if (parsed.url) url = parsed.url;
        if (parsed.commission) commission = parsed.commission;
      } catch {
        // Fallback to text
      }
    } else {
      description = c.notes;
    }
  }

  // Region detection from category
  let region: "Global" | "Egypt" | "Saudi Arabia" = "Global";
  const cat = (c.category || "").toLowerCase();
  if (cat.includes("saudi") || cat.includes("sa") || regionCode === "sa") {
    region = "Saudi Arabia";
    regionCode = "sa";
  } else if (cat.includes("egypt") || cat.includes("eg") || regionCode === "eg") {
    region = "Egypt";
    regionCode = "eg";
  } else {
    region = "Global";
    regionCode = "global";
  }

  // Lookup matching preset to fill missing details
  const preset = PRESET_PLATFORMS.find(
    (p) =>
      p.name.toLowerCase() === (c.name || "").toLowerCase() ||
      (c.name || "").toLowerCase().includes(p.id) ||
      (p.arabicName && (c.name || "").includes(p.arabicName.split(" ")[0]))
  );

  if (preset) {
    if (!url) url = preset.url;
    if (!description) description = preset.description;
    if (!bestFor) bestFor = preset.bestFor;
    if (!specialties.length) specialties = [...preset.specialties];
    if (!commission || commission === "Standard Commission") commission = preset.commission;
    if (!arabicName && preset.arabicName) arabicName = preset.arabicName;
    region = preset.region;
    regionCode = preset.regionCode;
  }

  return {
    id: c.id,
    name: c.name || "Untitled Platform",
    arabicName,
    region,
    regionCode,
    url: url || "https://",
    myProfileUrl,
    commission: commission || "Standard terms",
    description: description || "Freelance marketplace and talent contracting hub.",
    bestFor: bestFor || "Freelance projects & client inquiries",
    specialties: specialties.length > 0 ? specialties : ["Web Development", "Design"],
    tags: Array.isArray(c.tags) && c.tags.length > 0 ? c.tags : ["Freelance", "Marketplace"],
    status,
    updatedAt: c.updatedAt || Date.now(),
  };
}

export function serializePlatformConnector(
  platform: ParsedPlatform,
  existingCreatedAt?: number
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
    createdAt: existingCreatedAt || Date.now(),
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
