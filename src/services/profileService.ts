import { supabase } from "@/services/supabase";
import { ServiceResult } from "@/services/types";
import { OnboardingData, UserProfile } from "@/types";

export const profileService = {
  async getProfile(userId: string): Promise<ServiceResult<UserProfile>> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as UserProfile, error: null };
  },

  async updateProfile(
    userId: string,
    partial: Partial<UserProfile>
  ): Promise<ServiceResult<UserProfile>> {
    const payload = { ...partial, updated_at: new Date().toISOString() };

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as UserProfile, error: null };
  },

  async completeOnboarding(
    userId: string,
    onboardingData: OnboardingData
  ): Promise<ServiceResult<UserProfile>> {
    const payload: Partial<UserProfile> = {
      ...onboardingData,
      is_onboarded: true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as UserProfile, error: null };
  },
};
