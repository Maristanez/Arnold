import { create } from "zustand";
import { Program } from "@/types";

interface ProgramState {
  currentProgram: Program | null;
  isLoading: boolean;
  isGenerating: boolean;
  setProgram: (program: Program | null) => void;
  setLoading: (value: boolean) => void;
  setGenerating: (value: boolean) => void;
}

export const useProgramStore = create<ProgramState>((set) => ({
  currentProgram: null,
  isLoading: false,
  isGenerating: false,
  setProgram: (program) => set({ currentProgram: program }),
  setLoading: (value) => set({ isLoading: value }),
  setGenerating: (value) => set({ isGenerating: value }),
}));
