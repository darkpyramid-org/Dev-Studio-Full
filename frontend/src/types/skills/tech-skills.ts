import type { ElementType } from "react";
import type { TechAreaId, ServiceCategory } from "@shared/enums";

export type { TechAreaId, ServiceCategory };

/**
 * Tech Skills Type Definitions
 * Centralized types for all tech skill areas and related data structures
 */

// ── Shared Skill Concepts ──────────────────────────────────────────────────────

export interface SkillConcept {
  title: string;
  body: string;
}

export interface SkillResource {
  label: string;
  url: string;
  desc: string;
}

export interface SkillChecklistItem {
  id: string;
  label: string;
}

// ── Service Integration Types ──────────────────────────────────────────────────

export interface ServiceSnippet {
  lang: string;
  install: string;
  code: string;
}

export interface ServiceIntegration {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  docsUrl: string;
  packageName?: string;
  badge?: "Popular" | "Official" | "Recommended";
  snippet?: ServiceSnippet;
}

// ── Skill Area Data ────────────────────────────────────────────────────────────

export interface SkillSubArea {
  id: string;
  label: string;
  icon?: ElementType;
  color: string;
  accent: string;
  tags: string[];
  concepts?: SkillConcept[];
  resources?: SkillResource[];
  checklist?: SkillChecklistItem[];
  services?: ServiceIntegration[];
}

export interface SkillAreaData {
  id: TechAreaId;
  label: string;
  icon: ElementType;
  description: string;
  concepts: SkillConcept[];
  resources: SkillResource[];
  checklist: SkillChecklistItem[];
  subAreasLabel?: string;
  subAreas?: SkillSubArea[];
}

// ── Skill Tasks & Projects ────────────────────────────────────────────────────

export interface SkillTask {
  id: string;
  areaId: string;
  title: string;
  notes: string;
  done: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SkillProject {
  id: string;
  areaId: string;
  title: string;
  desc: string;
  url: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

// ── Component Props Types ──────────────────────────────────────────────────────

export interface SkillAreaProps {
  areaId: TechAreaId;
}

export interface TasksSectionProps {
  data: SkillAreaData;
  triggerAdd?: number;
}

export interface ProjectsSectionProps {
  data: SkillAreaData;
  triggerAdd?: number;
}

export interface ResourcesSectionProps {
  data: SkillAreaData;
}

export interface ServicesSectionProps {
  data: SkillAreaData;
}

export interface OverviewSectionProps {
  data: SkillAreaData;
}

export interface InterviewSectionProps {
  data: SkillAreaData;
}

export interface SkillTabsProps {
  areaId: TechAreaId;
}

// ── Internal Component Types ───────────────────────────────────────────────────

export type SectionId = "overview" | "interview" | "resources" | "services";

export interface SubAreaTab {
  id: string;
  label: string;
  icon?: ElementType;
}
