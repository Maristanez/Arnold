import { useCallback, useEffect, useState } from "react";
import { authService } from "@/services";
import { useAuthStore } from "@/store";

export function useAuth() {
  const { session, user, isLoading, isAuthenticated, setSession, setLoading } =
    useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      setLoading(true);
      const result = await authService.getSession();

      if (!isMounted) {
        return;
      }

      if (result.error) {
        setError(result.error);
      } else {
        setSession(result.data);
      }

      setLoading(false);
    };

    bootstrap();

    const unsubscribe = authService.onAuthStateChange((nextSession) => {
      if (isMounted) {
        setSession(nextSession);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [setLoading, setSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      const result = await authService.signIn(email, password);

      if (result.error) {
        setError(result.error);
      } else {
        setSession(result.data);
      }

      setLoading(false);
      return result;
    },
    [setLoading, setSession]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      const result = await authService.signUp(email, password);

      if (result.error) {
        setError(result.error);
      }

      setLoading(false);
      return result;
    },
    [setLoading]
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await authService.signOut();

    if (result.error) {
      setError(result.error);
    } else {
      setSession(null);
    }

    setLoading(false);
    return result;
  }, [setLoading, setSession]);

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    error,
    signIn,
    signUp,
    signOut,
  };
}
