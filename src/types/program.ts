export interface ProgramExercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g. "8-12" or "5"
  rest_seconds: number;
  notes?: string;
}

export interface ProgramDay {
  day_number: number;
  name: string; // e.g. "Push Day", "Upper Body"
  focus: string;
  exercises: ProgramExercise[];
}

export interface Program {
  id: string;
  user_id: string;
  name: string;
  description: string;
  days: ProgramDay[];
  fitness_identity: string;
  is_active: boolean;
  week_number: number;
  created_at: string;
  updated_at: string;
}
