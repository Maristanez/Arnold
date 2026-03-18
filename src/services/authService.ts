import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase";
import { ServiceResult } from "@/services/types";

export const authService = {
  async signUp(email: string, password: string): Promise<ServiceResult<User>> {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data.user ?? null, error: null };
  },

  async signIn(email: string, password: string): Promise<ServiceResult<Session>> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data.session ?? null, error: null };
  },

  async signOut(): Promise<ServiceResult<null>> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: null };
  },

  async getSession(): Promise<ServiceResult<Session | null>> {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data.session, error: null };
  },

  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });

    return () => subscription.unsubscribe();
  },
};
