import { create } from "zustand";
import { UserProfile } from "@/types";

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  isLoading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (value: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isOnboarded: false,
  isLoading: false,
  setProfile: (profile) =>
    set({
      profile,
      isOnboarded: Boolean(profile?.is_onboarded),
    }),
  setLoading: (value) => set({ isLoading: value }),
}));
