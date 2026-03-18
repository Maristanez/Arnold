export interface SessionSet {
  set_number: number;
  weight: number | null;
  reps: number | null;
  completed: boolean;
}

export interface SessionExercise {
  exercise_id: string;
  name: string;
  planned_sets: number;
  planned_reps: string;
  sets: SessionSet[];
  completed: boolean;
}

export interface Session {
  id: string;
  user_id: string;
  program_id: string;
  day_number: number;
  day_name: string;
  exercises: SessionExercise[];
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  ai_feedback: string | null;
  ai_assessment: string | null;
  created_at: string;
}
