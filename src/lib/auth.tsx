import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type OAuthProvider = "google" | "apple";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  provider: OAuthProvider;
  signedInAt: string;
  mode: "demo";
};

const STORAGE_KEY = "harness-auth-v1";

const PROVIDER_LABEL: Record<OAuthProvider, string> = {
  google: "Google",
  apple: "Apple",
};

export function providerLabel(provider: OAuthProvider): string {
  return PROVIDER_LABEL[provider];
}

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "HB";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function loadUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (
      (parsed.provider === "google" || parsed.provider === "apple") &&
      typeof parsed.name === "string" &&
      typeof parsed.email === "string"
    ) {
      return {
        id: typeof parsed.id === "string" ? parsed.id : "preview-session",
        name: parsed.name,
        email: parsed.email,
        provider: parsed.provider,
        signedInAt:
          typeof parsed.signedInAt === "string" ? parsed.signedInAt : new Date().toISOString(),
        mode: "demo",
      };
    }
  } catch {
    /* ignore corrupted storage */
  }
  return null;
}

type AuthContextValue = {
  user: AuthUser | null;
  signIn: (provider: OAuthProvider) => Promise<AuthUser>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser);

  const signIn = useCallback(async (provider: OAuthProvider) => {
    // This static build has no OAuth server. Simulate the provider handshake
    // locally so the workspace can be demonstrated end to end.
    await new Promise((resolve) => window.setTimeout(resolve, 650));

    const nextUser: AuthUser = {
      id: `preview-${provider}-${Date.now()}`,
      name: "Harness Builder",
      email: "builder@example.com",
      provider,
      signedInAt: new Date().toISOString(),
      mode: "demo",
    };

    setUser(nextUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } catch {
      /* storage unavailable — keep the session in memory */
    }
    return nextUser;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
