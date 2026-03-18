import { supabase } from "@/services/supabase";
import { ServiceResult } from "@/services/types";
import { Json, Session, SessionExercise } from "@/types";

export const sessionService = {
  async startSession(
    userId: string,
    programId: string,
    dayNumber: number,
    dayName: string,
    exercises: SessionExercise[]
  ): Promise<ServiceResult<Session>> {
    const payload = {
      user_id: userId,
      program_id: programId,
      day_number: dayNumber,
      day_name: dayName,
      exercises: exercises as unknown as Json,
      started_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("sessions")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Session, error: null };
  },

  async updateSessionExercise(
    sessionId: string,
    exercises: SessionExercise[]
  ): Promise<ServiceResult<Session>> {
    const { data, error } = await supabase
      .from("sessions")
      .update({
        exercises: exercises as unknown as Json,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Session, error: null };
  },

  async completeSession(
    sessionId: string,
    durationSeconds: number
  ): Promise<ServiceResult<Session>> {
    const payload = {
      completed_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("sessions")
      .update(payload)
      .eq("id", sessionId)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Session, error: null };
  },

  async updateSessionAIFeedback(
    sessionId: string,
    feedback: string,
    assessment: string
  ): Promise<ServiceResult<Session>> {
    const { data, error } = await supabase
      .from("sessions")
      .update({
        ai_feedback: feedback,
        ai_assessment: assessment,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Session, error: null };
  },

  async getSessionHistory(
    userId: string,
    limit = 20
  ): Promise<ServiceResult<Session[]>> {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data as Session[]) ?? [], error: null };
  },
};
