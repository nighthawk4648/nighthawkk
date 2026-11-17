"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authRequest } from "@/utils/authApi";

const AuthContext = createContext(null);

const here = () => (typeof window === "undefined" ? "/" : window.location.pathname + window.location.search);

// Who is signed in (email or Patreon, both give the same account), whether they are PRO,
// and the sign-in popup that any page can open.
export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ open: false, mode: "login", next: "/" });

  useEffect(() => {
    let alive = true;
    authRequest("/me", { method: "GET" }).then((res) => {
      if (!alive) return;
      setUserState(res.data?.user || null);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Signing in closes the popup
  const setUser = useCallback((next) => {
    setUserState(next);
    if (next) setAuthModal((m) => ({ ...m, open: false }));
  }, []);

  const signOut = useCallback(async () => {
    await authRequest("/logout");
    setUserState(null);
  }, []);

  // `next` is where Patreon sends the visitor back to; by default the page they are on
  const openAuth = useCallback((mode = "login", next) => setAuthModal({ open: true, mode, next: next ?? here() }), []);
  const closeAuth = useCallback(() => setAuthModal((m) => ({ ...m, open: false })), []);
  const setAuthMode = useCallback((mode) => setAuthModal((m) => ({ ...m, mode })), []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, signOut, authModal, openAuth, closeAuth, setAuthMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
