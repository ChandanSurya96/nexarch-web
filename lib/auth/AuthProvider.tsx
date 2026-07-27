"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiFetch, setAccessToken } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isPublic: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface TokenResponse {
  access_token: string;
}

interface MeResponse {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
}

function toAuthUser(me: MeResponse): AuthUser {
  return {
    id: me.id,
    email: me.email,
    username: me.username,
    displayName: me.display_name,
    bio: me.bio,
    avatarUrl: me.avatar_url,
    isPublic: me.is_public,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Silent refresh on mount (ADR-017): the access token only ever lives in
  // memory, so a hard refresh loses it — the httpOnly refresh cookie is what
  // survives, and this exchanges it for a fresh access token if one exists.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { access_token } = await apiFetch<TokenResponse>("/auth/refresh", {
          method: "POST",
        });
        if (cancelled) return;
        setAccessToken(access_token);
        const me = await apiFetch<MeResponse>("/users/me");
        if (!cancelled) setUser(toAuthUser(me));
      } catch {
        // No valid refresh cookie — the visitor is simply signed out.
        setAccessToken(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token } = await apiFetch<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(access_token);
    const me = await apiFetch<MeResponse>("/users/me");
    setUser(toAuthUser(me));
  }, []);

  const register = useCallback(
    async (email: string, password: string, username: string) => {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, username }),
      });
      await login(email, password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // /logout requires a valid access token (@jwt_required()) — after
      // 15+ minutes idle that token has expired, so the request never
      // reaches the server and the session is never revoked there. The
      // refresh cookie outlives it by a lot (30 days vs 15 minutes), so
      // refresh once and retry before giving up.
      try {
        const { access_token } = await apiFetch<TokenResponse>("/auth/refresh", {
          method: "POST",
        });
        setAccessToken(access_token);
        await apiFetch("/auth/logout", { method: "POST" });
      } catch {
        // No valid refresh cookie either — there's no session left to revoke.
      }
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
