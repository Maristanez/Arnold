import { useCallback, useRef, useState } from "react";
import {
  backboardService,
  claudeService,
  sessionService,
} from "@/services";
import { useAuthStore, useProgramStore } from "@/store";
import { Program, ProgramExercise, Session, SessionExercise } from "@/types";

interface WorkoutState {
  activeSession: Session | null;
  exercises: SessionExercise[];
  startedAt: number | null;
  aiSkipped: boolean;
  isLoading: boolean;
  error: string | null;
}

function mapProgramExerciseToSessionExercise(
  exercise: ProgramExercise
): SessionExercise {
  return {
    exercise_id: exercise.id,
    name: exercise.name,
    planned_sets: exercise.sets,
    planned_reps: exercise.reps,
    sets: Array.from({ length: exercise.sets }).map((_, index) => ({
      set_number: index + 1,
      weight: null,
      reps: null,
      completed: false,
    })),
    completed: false,
  };
}

export function useWorkout() {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const program = useProgramStore((state) => state.currentProgram);
  const [state, setState] = useState<WorkoutState>({
    activeSession: null,
    exercises: [],
    startedAt: null,
    aiSkipped: false,
    isLoading: false,
    error: null,
  });
  const startTimestampRef = useRef<number | null>(null);

  const startWorkout = useCallback(
    async (dayNumber: number) => {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      if (!program) {
        return { data: null, error: "No active program" };
      }

      const programDay = program.days.find((day) => day.day_number === dayNumber);
      if (!programDay) {
        return { data: null, error: "Program day not found" };
      }

      setState((current) => ({ ...current, isLoading: true, error: null }));
      const exercises = programDay.exercises.map(mapProgramExerciseToSessionExercise);

      const result = await sessionService.startSession(
        userId,
        program.id,
        dayNumber,
        programDay.name,
        exercises
      );

      if (result.error || !result.data) {
        setState((current) => ({
          ...current,
          isLoading: false,
          error: result.error ?? "Failed to start workout",
        }));
        return result;
      }

      const now = Date.now();
      startTimestampRef.current = now;
      setState((current) => ({
        ...current,
        activeSession: result.data,
        exercises,
        startedAt: now,
        aiSkipped: false,
        isLoading: false,
      }));

      return result;
    },
    [userId, program]
  );

  const logSet = useCallback(
    async (exerciseId: string, setNumber: number, weight: number, reps: number) => {
      if (!state.activeSession) {
        return { data: null, error: "No active workout session" };
      }

      const exercises = state.exercises.map((exercise) => {
        if (exercise.exercise_id !== exerciseId) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.set_number === setNumber
              ? { ...set, weight, reps, completed: true }
              : set
          ),
        };
      });

      setState((current) => ({ ...current, exercises }));

      const result = await sessionService.updateSessionExercise(
        state.activeSession.id,
        exercises
      );

      if (result.error) {
        setState((current) => ({ ...current, error: result.error }));
      }

      return result;
    },
    [state.activeSession, state.exercises]
  );

  const completeExercise = useCallback((exerciseId: string) => {
    setState((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.exercise_id === exerciseId ? { ...exercise, completed: true } : exercise
      ),
    }));
  }, []);

  const completeWorkout = useCallback(async () => {
    if (!state.activeSession || !userId) {
      return { data: null, error: "No active session" };
    }

    setState((current) => ({ ...current, isLoading: true, error: null }));

    const durationSeconds = Math.max(
      0,
      Math.floor((Date.now() - (startTimestampRef.current ?? Date.now())) / 1000)
    );

    const completeResult = await sessionService.completeSession(
      state.activeSession.id,
      durationSeconds
    );

    if (completeResult.error || !completeResult.data) {
      setState((current) => ({
        ...current,
        isLoading: false,
        error: completeResult.error ?? "Unable to complete session",
      }));
      return completeResult;
    }

    let aiSkipped = false;
    let checkInData: { summary: string; assessment: string } | null = null;

    if (program) {
      const checkInResult = await claudeService.generateCheckIn(
        completeResult.data,
        program as Program
      );

      if (checkInResult.error || !checkInResult.data) {
        aiSkipped = true;
      } else {
        checkInData = {
          summary: checkInResult.data.summary,
          assessment: checkInResult.data.assessment,
        };
      }
    } else {
      aiSkipped = true;
    }

    if (checkInData) {
      await sessionService.updateSessionAIFeedback(
        completeResult.data.id,
        checkInData.summary,
        checkInData.assessment
      );
    }

    await backboardService.storeSessionMemory(userId, {
      ...completeResult.data,
      ai_feedback: checkInData?.summary ?? completeResult.data.ai_feedback,
      ai_assessment: checkInData?.assessment ?? completeResult.data.ai_assessment,
    });

    setState((current) => ({
      ...current,
      activeSession: null,
      exercises: [],
      startedAt: null,
      aiSkipped,
      isLoading: false,
    }));

    startTimestampRef.current = null;

    return { data: completeResult.data, error: null };
  }, [program, state.activeSession, userId]);

  return {
    ...state,
    startWorkout,
    logSet,
    completeExercise,
    completeWorkout,
  };
}
