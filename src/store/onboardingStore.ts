import { create } from "zustand";
import { OnboardingData } from "@/types";

interface OnboardingState {
  data: Partial<OnboardingData>;
  setField: <K extends keyof OnboardingData>(
    key: K,
    value: OnboardingData[K]
  ) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  data: {},
  setField: (key, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [key]: value,
      },
    })),
  reset: () => set({ data: {} }),
}));
