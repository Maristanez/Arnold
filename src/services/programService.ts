import { supabase } from "@/services/supabase";
import { ServiceResult } from "@/services/types";
import { Program } from "@/types";

export const programService = {
  async getCurrentProgram(userId: string): Promise<ServiceResult<Program | null>> {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data as Program | null) ?? null, error: null };
  },

  async createProgram(
    userId: string,
    program: Omit<Program, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<ServiceResult<Program>> {
    const { data: existing } = await supabase
      .from("programs")
      .update({ is_active: false })
      .eq("user_id", userId)
      .eq("is_active", true)
      .select("id");

    void existing;

    const insertPayload = {
      user_id: userId,
      name: program.name,
      description: program.description,
      fitness_identity: program.fitness_identity,
      days: program.days,
      is_active: program.is_active,
      week_number: program.week_number,
    };

    const { data, error } = await supabase
      .from("programs")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Program, error: null };
  },

  async getProgramHistory(userId: string): Promise<ServiceResult<Program[]>> {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data as Program[]) ?? [], error: null };
  },
};
