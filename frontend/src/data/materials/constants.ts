/**
 * Materials UI Constants
 * Pure enum values come from the backend via @shared/enums.
 * This file only adds frontend-specific UI data (colors, type options).
 */

// ── Re-export pure enum values from the single backend source of truth ─────────

import type { MaterialType } from "@shared/enums";

export {
  MATERIAL_TYPES,
  TYPE_LABELS,
  MATERIAL_AREA_IDS,
  MATERIAL_AREA_LABELS,
  MATERIAL_FILTERS,
  isMaterialArea,
  isMaterialType,
} from "@shared/enums";

export type {
  MaterialType,
  MaterialAreaId,
  Material,
  Area,
  AreaGroup,
} from "@shared/enums";

// ── UI-only: color map for material types ──────────────────────────────────────

export const TYPE_COLORS: Record<MaterialType, string> = {
  book: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  course: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  docs: "bg-green-500/10 text-green-500 border-green-500/20",
  tool: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

// ── UI-only: filter options with "all" option prepended ───────────────────────

export const MATERIAL_TYPE_OPTIONS: { id: MaterialType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "book", label: "Books" },
  { id: "course", label: "Courses" },
  { id: "docs", label: "Docs" },
  { id: "tool", label: "Tools" },
];
