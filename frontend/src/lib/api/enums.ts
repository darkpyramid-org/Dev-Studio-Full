import { apiFetch } from "./base";
import type {
  TechAreaId,
  SoftAreaId,
  QuestionDifficulty,
  QuestionArea,
  ServiceCategory,
  TaskPriority,
  TaskStatus,
  MaterialType,
  MaterialAreaId,
  TaskCategory,
  JobStatus,
  JobPlatform,
  OfferStatus,
  OfferPlatform,
  ServiceStatus,
  ServicePlatform,
  CVFocus,
  CVLanguageLevel,
  ATSGrade,
  AgentStatus,
  AssetKind,
  ConnectorType,
  SocialPlatform,
  MailChannel,
  NotificationType,
  ActivityAction,
  ActivityEntityType,
  ActivityType,
  Currency,
} from "@shared/enums";
import type { JobCategory, OfferCategory, FreelanceServiceCategory } from "@shared/enums";

export interface AppEnums {
  skills: {
    TECH_AREA_IDS: readonly TechAreaId[];
    TECH_AREA_LABELS: Record<string, string>;
    SOFT_AREA_ID: SoftAreaId;
    SOFT_SKILL_AREA_LABEL: string;
    SOFT_SKILL_GROUPS: Record<string, { id: string; label: string }[]>;
    SPECIAL_SUB_AREAS: Record<string, { id: string; label: string; tags: readonly string[] }>;
    QUESTION_DIFFICULTIES: readonly QuestionDifficulty[];
    QUESTION_AREAS: readonly QuestionArea[];
    DEPTH_LABEL_PRESETS: readonly string[];
    SERVICE_CATEGORIES: readonly ServiceCategory[];
    TASK_PRIORITIES: readonly TaskPriority[];
    TASK_STATUSES: readonly TaskStatus[];
    SKILL_ITEM_PRIORITIES: readonly string[];
  };
  materials: {
    MATERIAL_TYPES: readonly MaterialType[];
    TYPE_LABELS: Record<string, string>;
    MATERIAL_AREA_IDS: readonly MaterialAreaId[];
    MATERIAL_AREA_LABELS: Record<string, string>;
    MATERIAL_FILTERS: { id: string; label: string }[];
  };
  planner: {
    TASK_CATEGORIES: readonly TaskCategory[];
  };
  jobs: {
    JOB_STATUSES: readonly JobStatus[];
    JOB_PLATFORMS: readonly JobPlatform[];
    JOB_CATEGORIES: readonly JobCategory[];
  };
  offers: {
    OFFER_STATUSES: readonly OfferStatus[];
    OFFER_PLATFORMS: readonly OfferPlatform[];
    OFFER_CATEGORIES: readonly OfferCategory[];
  };
  services: {
    SERVICE_STATUSES: readonly ServiceStatus[];
    SERVICE_PLATFORMS: readonly ServicePlatform[];
    FREELANCE_SERVICE_CATEGORIES: readonly FreelanceServiceCategory[];
  };
  cv: {
    CV_FOCUSES: readonly CVFocus[];
    CV_LANGUAGE_LEVELS: readonly CVLanguageLevel[];
    ATS_GRADES: readonly ATSGrade[];
  };
  core: {
    AGENT_STATUSES: readonly AgentStatus[];
    ASSET_KINDS: readonly AssetKind[];
  };
  integrations: {
    CONNECTOR_TYPES: readonly ConnectorType[];
    SOCIAL_PLATFORMS: readonly SocialPlatform[];
    MAIL_CHANNELS: readonly MailChannel[];
  };
  notifications: {
    NOTIFICATION_TYPES: readonly NotificationType[];
  };
  activity: {
    ACTIVITY_ACTIONS: readonly ActivityAction[];
    ACTIVITY_ENTITY_TYPES: readonly ActivityEntityType[];
    ACTIVITY_TYPES: readonly ActivityType[];
  };
  currencies: readonly Currency[];
}

export async function getEnums(): Promise<AppEnums> {
  return apiFetch<AppEnums>("/api/enums");
}
