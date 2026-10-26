import type { QuestionDifficulty as Difficulty, QuestionArea as FocusArea, AssetKind } from "@shared/enums";

export type { Difficulty, FocusArea, AssetKind };

export interface AnswerDepth {
  id: string;
  label: string;
  body: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string | null;
  profileImage?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

export interface UserProfile {
  displayName: string | null;
  avatarUrl: string | null;
  location: string | null;
}

export interface UsePresenceResult {
  online: string[];
  connected: boolean;
}
