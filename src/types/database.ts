export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          fitness_identity: string | null;
          current_goals: string[];
          experience_level: string | null;
          years_training: number | null;
          injuries: string[];
          days_per_week: number;
          session_duration: number;
          equipment: string[];
          is_onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          fitness_identity?: string | null;
          current_goals?: string[];
          experience_level?: string | null;
          years_training?: number | null;
          injuries?: string[];
          days_per_week?: number;
          session_duration?: number;
          equipment?: string[];
          is_onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          fitness_identity?: string | null;
          current_goals?: string[];
          experience_level?: string | null;
          years_training?: number | null;
          injuries?: string[];
          days_per_week?: number;
          session_duration?: number;
          equipment?: string[];
          is_onboarded?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          fitness_identity: string;
          days: Json;
          is_active: boolean;
          week_number: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          fitness_identity: string;
          days: Json;
          is_active?: boolean;
          week_number?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          fitness_identity?: string;
          days?: Json;
          is_active?: boolean;
          week_number?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          program_id: string;
          day_number: number;
          day_name: string;
          exercises: Json;
          started_at: string;
          completed_at: string | null;
          duration_seconds: number | null;
          ai_feedback: string | null;
          ai_assessment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          program_id: string;
          day_number: number;
          day_name: string;
          exercises: Json;
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
          ai_feedback?: string | null;
          ai_assessment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          exercises?: Json;
          completed_at?: string | null;
          duration_seconds?: number | null;
          ai_feedback?: string | null;
          ai_assessment?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          meal_type: string;
          foods: Json;
          macros_total: Json;
          logged_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_type: string;
          foods: Json;
          macros_total: Json;
          logged_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          foods?: Json;
          macros_total?: Json;
          logged_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_memories: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          content: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          content: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          content?: string;
          metadata?: Json;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
