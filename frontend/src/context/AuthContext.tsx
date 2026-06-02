import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

type User = { id: string; name: string; email: string; role: "user" | "admin" };
type AuthCtx = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  hydrateMe: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

function readToken() {
  return localStorage.getItem("careerpilot.accessToken");
}
function readRefreshToken() {
  return localStorage.getItem("careerpilot.refreshToken");
}
function readUser(): User | null {
  try {
    const raw = localStorage.getItem("careerpilot.user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken);
  const [refreshToken, setRefreshToken] = useState<string | null>(readRefreshToken);
  const [user, setUser] = useState<User | null>(readUser);

  const syncFromStorage = useCallback(() => {
    setToken(readToken());
    setRefreshToken(readRefreshToken());
    setUser(readUser());
  }, []);

  useEffect(() => {
    window.addEventListener("careerpilot:auth", syncFromStorage);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener("careerpilot:auth", syncFromStorage);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [syncFromStorage]);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      token,
      refreshToken,
      async login(email, password) {
        console.log("[AUTH] Login attempt:", { email: email?.toLowerCase() });
        const { data } = await api.post("/auth/login", { email, password });
        console.log("[AUTH] Login response received, storing tokens");
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser(data.user);
        localStorage.setItem("careerpilot.accessToken", data.accessToken);
        localStorage.setItem("careerpilot.refreshToken", data.refreshToken);
        localStorage.setItem("careerpilot.user", JSON.stringify(data.user));
      },
      async signup(name, email, password) {
        console.log("[AUTH] Signup attempt:", { email: email?.toLowerCase() });
        const { data } = await api.post("/auth/signup", { name, email, password });
        console.log("[AUTH] Signup response received, storing tokens");
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser(data.user);
        localStorage.setItem("careerpilot.accessToken", data.accessToken);
        localStorage.setItem("careerpilot.refreshToken", data.refreshToken);
        localStorage.setItem("careerpilot.user", JSON.stringify(data.user));
      },
      async loginWithGoogle(idToken) {
        console.log("[AUTH] Google login attempt");
        const { data } = await api.post("/auth/google", { idToken });
        console.log("[AUTH] Google login response received");
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser(data.user);
        localStorage.setItem("careerpilot.accessToken", data.accessToken);
        localStorage.setItem("careerpilot.refreshToken", data.refreshToken);
        localStorage.setItem("careerpilot.user", JSON.stringify(data.user));
      },
      async hydrateMe() {
        const stored = readToken();
        if (!stored) {
          console.log("[AUTH] hydrateMe: no token stored");
          return;
        }
        console.log("[AUTH] hydrateMe: fetching /auth/me");
        try {
          const { data } = await api.get("/auth/me");
          console.log("[AUTH] hydrateMe: success, user:", data.user?.email);
          setUser(data.user);
          localStorage.setItem("careerpilot.user", JSON.stringify(data.user));
        } catch (err) {
          console.log("[AUTH] hydrateMe: failed", err instanceof Error ? err.message : String(err));
        }
      },
      logout() {
        api.post("/auth/logout").catch(() => {});
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem("careerpilot.accessToken");
        localStorage.removeItem("careerpilot.refreshToken");
        localStorage.removeItem("careerpilot.user");
      }
    }),
    [token, refreshToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

