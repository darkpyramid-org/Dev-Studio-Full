/**
 * Skills UI Constants
 * Pure enum values come from the backend via @shared/enums.
 * This file only adds frontend-specific UI data (icons, colors, labels).
 */

import {
  Clock,
  Sparkles,
  Brain,
  Swords,
  Wifi,
  Terminal,
  GitPullRequest,
  Repeat2,
  Trophy,
} from "lucide-react";
import type { ElementType } from "react";

// ── Re-export pure enum values from the single backend source of truth ─────────

export {
  TECH_AREA_IDS,
  TECH_AREA_LABELS,
  SOFT_AREA_ID,
  SOFT_SKILL_AREA_LABEL,
  QUESTION_DIFFICULTIES,
  QUESTION_AREAS,
  DEPTH_LABEL_PRESETS,
  SERVICE_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  SKILL_ITEM_PRIORITIES,
  getAllSoftSkillItems,
  getSoftSkillItemById,
  getSoftSkillCategory,
  isTechArea,
  isSoftSkillArea,
} from "@shared/enums";

export type {
  TechAreaId,
  SoftAreaId,
  QuestionDifficulty,
  QuestionArea,
  ServiceCategory,
  TaskPriority,
  TaskStatus,
  SkillItemPriority,
} from "@shared/enums";

// ── Soft Skill item type with optional React icon ──────────────────────────────

export interface SoftSkillItem {
  id: string;
  label: string;
  icon?: ElementType;
}

export interface SoftSkillCategory {
  [category: string]: SoftSkillItem[];
}

// ── UI mirror of backend SOFT_SKILL_GROUPS; IDs and labels must stay in sync.
// This layer adds React icons, which cannot live in the backend's shared constants.

export const SOFT_SKILL_GROUPS: Record<string, SoftSkillItem[]> = {
  leadership: [
    { id: "time", label: "Time Management", icon: Clock },
    { id: "growth", label: "Growth Mindset", icon: Sparkles },
    { id: "mental-models", label: "Mental Models", icon: Brain },
  ],
  teamwork: [
    { id: "conflict", label: "Conflict Resolution", icon: Swords },
    { id: "remote", label: "Remote Collaboration", icon: Wifi },
    { id: "pairing", label: "Pair Programming", icon: Terminal },
    { id: "code-review", label: "Code Review Culture", icon: GitPullRequest },
    { id: "agile", label: "Agile / Scrum", icon: Repeat2 },
  ],
};

// ── Special sub-areas — same IDs as backend, adds UI styling ──────────────────

export const SPECIAL_SUB_AREAS = {
  TOP_10: {
    id: "top-10",
    label: "Top 10 Questions",
    icon: Trophy,
    color: "border-primary/40 bg-primary/10 text-primary",
    accent: "border-primary/30",
    tags: ["interview", "hr", "behavioral", "career"],
  },
} as const;

// ── Domain config (UI-only, not in backend) ────────────────────────────────────

export interface DomainConfig {
  id: string;
  label: string;
  icon: ElementType;
}

export const DOMAINS: DomainConfig[] = [
  { id: "frontend", label: "Frontend", icon: Terminal },
  { id: "backend", label: "Backend", icon: Terminal },
  { id: "database", label: "Database", icon: Terminal },
  { id: "devops", label: "DevOps", icon: Terminal },
  { id: "architecture", label: "Architecture", icon: Terminal },
  { id: "core", label: "Core CS", icon: Terminal },
];

// ── Utility ────────────────────────────────────────────────────────────────────

export function getAllSoftSkillItemsWithIcons(): SoftSkillItem[] {
  return Object.values(SOFT_SKILL_GROUPS).flat();
}
