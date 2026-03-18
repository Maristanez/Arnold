export type FitnessIdentity =
  | "bodybuilder"
  | "powerlifter"
  | "athlete"
  | "crossfitter"
  | "casual"
  | "beginner";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface UserProfile {
  id: string;
  email: string;
  fitness_identity: FitnessIdentity | null;
  current_goals: string[];
  experience_level: ExperienceLevel | null;
  years_training: number | null;
  injuries: string[];
  days_per_week: number;
  session_duration: number;
  equipment: string[];
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingData {
  fitness_identity: FitnessIdentity;
  current_goals: string[];
  experience_level: ExperienceLevel;
  years_training: number;
  injuries: string[];
  days_per_week: number;
  session_duration: number;
  equipment: string[];
}

export interface TrainingHistory {
  experience_level: ExperienceLevel;
  years_training: number;
  injuries: string[];
}

export interface UserPreferences {
  days_per_week: number;
  session_duration: number;
  equipment: string[];
}
