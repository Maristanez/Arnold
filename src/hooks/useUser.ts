import { useCallback, useEffect, useState } from "react";
import { profileService } from "@/services";
import { useAuthStore, useUserStore } from "@/store";
import { OnboardingData } from "@/types";

export function useUser() {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const { profile, isOnboarded, isLoading, setProfile, setLoading } = useUserStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!userId) {
        setProfile(null);
        return;
      }

      setLoading(true);
      const result = await profileService.getProfile(userId);

      if (!isMounted) {
        return;
      }

      if (result.error) {
        setError(result.error);
      } else {
        setProfile(result.data);
      }

      setLoading(false);
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [userId, setLoading, setProfile]);

  const completeOnboarding = useCallback(
    async (data: OnboardingData) => {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      setLoading(true);
      setError(null);

      const result = await profileService.completeOnboarding(userId, data);

      if (result.error) {
        setError(result.error);
      } else {
        setProfile(result.data);
      }

      setLoading(false);
      return result;
    },
    [userId, setLoading, setProfile]
  );

  return {
    profile,
    isOnboarded,
    isLoading,
    error,
    completeOnboarding,
  };
}
