export interface ExerciseAdjustment {
  exercise_name: string;
  adjustment: string;
  reason: string;
}

export interface AICheckInResponse {
  summary: string;
  assessment: "strong" | "solid" | "challenging" | "needs_recovery";
  encouragement: string;
  adjustments: ExerciseAdjustment[];
}

export interface BackboardMemory {
  id: string;
  type: "session" | "nutrition" | "preference" | "progress";
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}
