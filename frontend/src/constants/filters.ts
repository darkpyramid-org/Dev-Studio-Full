/**
 * Centralized Filter Constants
 * All filter configurations and filter-related data, derived from @shared/enums.
 * Organized by feature domain — no raw values defined here.
 */

import {
  MATERIAL_TYPES,
  MATERIAL_AREA_IDS,
  JOB_STATUSES,
  OFFER_STATUSES,
  SERVICE_STATUSES,
  JOB_PLATFORMS,
  OFFER_PLATFORMS,
  SERVICE_PLATFORMS,
  CV_FOCUSES,
  QUESTION_DIFFICULTIES,
  QUESTION_AREAS,
  SOCIAL_PLATFORMS,
  MAIL_CHANNELS,
  CONNECTOR_TYPES,
  ACTIVITY_TYPES,
  TECH_AREA_IDS,
} from "@shared/enums";

// ── Material Filters ───────────────────────────────────────────────────────────

export const MATERIAL_FILTERS = {
  type: MATERIAL_TYPES,
  area: MATERIAL_AREA_IDS,
} as const;

// ── Job Status Filters ─────────────────────────────────────────────────────────

export const JOB_STATUS_FILTERS = JOB_STATUSES;

// ── Offer Status Filters ──────────────────────────────────────────────────────

export const OFFER_STATUS_FILTERS = OFFER_STATUSES;

// ── Service Status Filters ────────────────────────────────────────────────────

export const SERVICE_STATUS_FILTERS = SERVICE_STATUSES;

// ── Platform Filters (all platforms combined for generic filter UIs) ───────────

const _allPlatforms = [
  ...JOB_PLATFORMS,
  ...OFFER_PLATFORMS,
  ...SERVICE_PLATFORMS,
] as const;

export const PLATFORM_FILTERS = [
  ...new Set(_allPlatforms),
] as const;

// ── CV Focus Filters ──────────────────────────────────────────────────────────

export const CV_FOCUS_FILTERS = CV_FOCUSES;

// ── Interview Difficulty Filters ──────────────────────────────────────────────

export const DIFFICULTY_FILTERS = QUESTION_DIFFICULTIES;

// ── Interview Domain Filters ──────────────────────────────────────────────────

export const DOMAIN_FILTERS = QUESTION_AREAS;

// ── Soft Skill Category Filters ────────────────────────────────────────────────

export const SOFT_SKILL_CATEGORY_FILTERS = [
  "communication",
  "leadership",
  "problem-solving",
  "teamwork",
] as const;

// ── Tech Skill Area Filters ────────────────────────────────────────────────────

export const TECH_SKILL_AREA_FILTERS = TECH_AREA_IDS;

// ── Activity Type Filters ──────────────────────────────────────────────────────

export const ACTIVITY_TYPE_FILTERS = ACTIVITY_TYPES;

// ── Social Platform Filters ───────────────────────────────────────────────────

export const SOCIAL_PLATFORM_FILTERS = SOCIAL_PLATFORMS;

// ── Mail Channel Filters ──────────────────────────────────────────────────────

export const MAIL_CHANNEL_FILTERS = MAIL_CHANNELS;

// ── Connector Type Filters ────────────────────────────────────────────────────

export const CONNECTOR_TYPE_FILTERS = CONNECTOR_TYPES;

// ── Sidebar List Filter Options ────────────────────────────────────────────────

export const CONNECTOR_CONTACT_FILTERS = [
  { label: "All", value: "all" },
  { label: "Has Email", value: "email" },
  { label: "Has Phone", value: "phone" },
];

export const MAIL_LIST_FILTERS = [
  { label: "All", value: "all" },
  { label: "Recent", value: "recent" },
  { label: "A–Z", value: "az" },
];

export const SOCIAL_DATE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Recent", value: "recent" },
  { label: "Older", value: "older" },
];

export const JOB_SIDEBAR_FILTERS = [
  { label: "All", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Interview", value: "interview" },
];

// ── Utility: Get filter options ────────────────────────────────────────────────

export function getFilterOptions(
  filterType:
    | "material-type"
    | "material-area"
    | "job-status"
    | "offer-status"
    | "service-status"
    | "platform"
    | "cv-focus"
    | "difficulty"
    | "domain"
    | "soft-skill-category"
    | "tech-skill-area"
    | "activity-type"
    | "social-platform"
    | "mail-channel"
    | "connector-type"
): readonly string[] {
  const filters: Record<string, readonly string[]> = {
    "material-type": MATERIAL_FILTERS.type,
    "material-area": MATERIAL_FILTERS.area,
    "job-status": JOB_STATUS_FILTERS,
    "offer-status": OFFER_STATUS_FILTERS,
    "service-status": SERVICE_STATUS_FILTERS,
    platform: PLATFORM_FILTERS,
    "cv-focus": CV_FOCUS_FILTERS,
    difficulty: DIFFICULTY_FILTERS,
    domain: DOMAIN_FILTERS,
    "soft-skill-category": SOFT_SKILL_CATEGORY_FILTERS,
    "tech-skill-area": TECH_SKILL_AREA_FILTERS,
    "activity-type": ACTIVITY_TYPE_FILTERS,
    "social-platform": SOCIAL_PLATFORM_FILTERS,
    "mail-channel": MAIL_CHANNEL_FILTERS,
    "connector-type": CONNECTOR_TYPE_FILTERS,
  };

  return filters[filterType] ?? [];
}
