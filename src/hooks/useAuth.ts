import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

function promiseWithTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(message)), ms);
    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        window.clearTimeout(timer);
        reject(err);
      });
  });
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isAdminKnown: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAdmin: false,
    isAdminKnown: false,
    isLoading: true,
    error: null,
  });

  const checkAdminStatus = useCallback(async (userId: string) => {
    try {
      // Preferred: server-side SECURITY DEFINER function avoids RLS/network quirks.
      const rpc = await supabase.rpc("is_admin", { _user_id: userId });
      if (!rpc.error) return Boolean(rpc.data);
      console.error("[useAuth] is_admin rpc failed", { userId, error: rpc.error });

      // Fallback: direct table lookup (may be blocked by RLS depending on policies).
      const { data, error } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("[useAuth] admin check failed", { userId, error });
      }
      return !error && data !== null;
    } catch {
      return false;
    }
  }, []);

  const refresh = useCallback(async () => {
    setAuthState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Hard timeout so auth init can NEVER hang the UI.
      const { data, error } = await promiseWithTimeout(
        supabase.auth.getSession(),
        8000,
        "Authentication initialization timed out"
      );
      if (error) throw error;

      const session = data.session;
      if (session?.user) {
        const isAdmin = await checkAdminStatus(session.user.id);
        setAuthState({
          user: session.user,
          session,
          isAdmin,
          isAdminKnown: true,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          session: null,
          isAdmin: false,
          isAdminKnown: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (err: any) {
      const message = err?.message || "Failed to initialize authentication";
      console.error("[useAuth] getSession failed", err);
      setAuthState({
        user: null,
        session: null,
        isAdmin: false,
        isAdminKnown: true,
        isLoading: false,
        error: message,
      });
    }
  }, [checkAdminStatus]);

  useEffect(() => {
    let cancelled = false;

    // Safety net: never allow an infinite auth spinner.
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      setAuthState((prev) => {
        if (!prev.isLoading) return prev;
        return {
          ...prev,
          isLoading: false,
          isAdminKnown: true,
          error: prev.error ?? "Authentication timed out. Please retry.",
        };
      });
    }, 10_000);

    // Listen for auth changes.
    // IMPORTANT: keep the callback synchronous to avoid Supabase auth event deadlocks.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;

      if (session?.user) {
        // Immediate state update; admin check is deferred.
        // IMPORTANT: keep the callback synchronous to avoid Supabase auth event deadlocks.
        setAuthState({
          user: session.user,
          session,
          isAdmin: false,
          isAdminKnown: false,
          isLoading: false,
          error: null,
        });

        window.setTimeout(async () => {
          try {
            const isAdmin = await checkAdminStatus(session.user.id);
            if (cancelled) return;
            setAuthState({
              user: session.user,
              session,
              isAdmin,
              isAdminKnown: true,
              isLoading: false,
              error: null,
            });
          } catch (err: any) {
            console.error("[useAuth] deferred admin check failed", { event, err });
            // Keep the user/session; only admin flag falls back to false.
            if (cancelled) return;
            setAuthState({
              user: session.user,
              session,
              isAdmin: false,
              isAdminKnown: true,
              isLoading: false,
              error: null,
            });
          }
        }, 0);
      } else {
        setAuthState({
          user: null,
          session: null,
          isAdmin: false,
          isAdminKnown: true,
          isLoading: false,
          error: null,
        });
      }
    });

    refresh().finally(() => {
      if (!cancelled) window.clearTimeout(timer);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [checkAdminStatus, refresh]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    ...authState,
    signIn,
    signOut,
    refresh,
  };
}
