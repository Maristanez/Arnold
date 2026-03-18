import { BackboardMemory, Json, Macros, Session } from "@/types";
import { supabase } from "@/services/supabase";
import { ServiceResult } from "@/services/types";

export const backboardService = {
  async storeMemory(
    userId: string,
    type: BackboardMemory["type"],
    content: string,
    metadata: Record<string, unknown> = {}
  ): Promise<ServiceResult<BackboardMemory>> {
    const { data, error } = await supabase
      .from("ai_memories")
      .insert({
        user_id: userId,
        type,
        content,
        metadata: metadata as unknown as Json,
      })
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as BackboardMemory, error: null };
  },

  async retrieveMemories(
    userId: string,
    type?: BackboardMemory["type"],
    limit = 10
  ): Promise<ServiceResult<BackboardMemory[]>> {
    let query = supabase
      .from("ai_memories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data as BackboardMemory[]) ?? [], error: null };
  },

  async storeSessionMemory(
    userId: string,
    session: Session
  ): Promise<ServiceResult<BackboardMemory>> {
    const content = `Session completed: ${session.day_name}`;
    const metadata = {
      session_id: session.id,
      program_id: session.program_id,
      day_number: session.day_number,
      duration_seconds: session.duration_seconds,
      assessment: session.ai_assessment,
    };

    return this.storeMemory(userId, "session", content, metadata);
  },

  async storeNutritionMemory(
    userId: string,
    macros: Macros
  ): Promise<ServiceResult<BackboardMemory>> {
    const content = `Daily nutrition summary logged`;
    const metadata = {
      calories: macros.calories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
    };

    return this.storeMemory(userId, "nutrition", content, metadata);
  },
};
