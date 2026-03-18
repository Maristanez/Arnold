import { useCallback, useEffect, useState } from "react";
import {
  backboardService,
  claudeService,
  programService,
} from "@/services";
import { useAuthStore, useProgramStore } from "@/store";
import { OnboardingData, Program } from "@/types";

export function useProgram() {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const {
    currentProgram,
    isLoading,
    isGenerating,
    setProgram,
    setLoading,
    setGenerating,
  } = useProgramStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentProgram = async () => {
      if (!userId) {
        setProgram(null);
        return;
      }

      setLoading(true);
      const result = await programService.getCurrentProgram(userId);

      if (!isMounted) {
        return;
      }

      if (result.error) {
        setError(result.error);
      } else {
        setProgram(result.data);
      }

      setLoading(false);
    };

    loadCurrentProgram();

    return () => {
      isMounted = false;
    };
  }, [userId, setLoading, setProgram]);

  const generateNewProgram = useCallback(
    async (onboardingData: OnboardingData) => {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      setGenerating(true);
      setError(null);

      const memoriesResult = await backboardService.retrieveMemories(userId, undefined, 10);
      const memoryList = memoriesResult.data ?? [];

      const generatedResult = await claudeService.generateProgram(
        onboardingData,
        memoryList
      );

      if (generatedResult.error || !generatedResult.data) {
        setGenerating(false);
        setError(generatedResult.error ?? "Program generation failed");
        return generatedResult;
      }

      const payload: Omit<Program, "id" | "user_id" | "created_at" | "updated_at"> = {
        name: generatedResult.data.name,
        description: generatedResult.data.description,
        fitness_identity: generatedResult.data.fitness_identity,
        days: generatedResult.data.days,
        is_active: true,
        week_number: generatedResult.data.week_number,
      };

      const savedResult = await programService.createProgram(userId, payload);

      if (savedResult.error) {
        setError(savedResult.error);
      } else {
        setProgram(savedResult.data);
      }

      setGenerating(false);
      return savedResult;
    },
    [userId, setGenerating, setProgram]
  );

  return {
    currentProgram,
    isLoading,
    isGenerating,
    error,
    generateNewProgram,
  };
}
