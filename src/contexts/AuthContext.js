"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authRequest } from "@/utils/authApi";

const AuthContext = createContext(null);

// Who is signed in (email or Patreon, both give the same account), and whether they are PRO.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    authRequest("/me", { method: "GET" }).then((res) => {
      if (!alive) return;
      setUser(res.data?.user || null);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const signOut = useCallback(async () => {
    await authRequest("/logout");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
