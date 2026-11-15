export type AiUser = {
  name: string;
  email: string;
};

export type BrowserConnection = "connected" | "skipped";

export type AiSession = {
  user: AiUser;
  connection: BrowserConnection | null;
  signedInAt: number;
};

const SESSION_KEY = "harness-ai-session-v1";
const GUIDE_KEY = "harness-ai-guide-v1";

export function nameFromEmail(email: string): string {
  const local = email.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  if (!local) return "there";
  return local
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function loadAiSession(): AiSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AiSession>;
    const email = parsed.user?.email?.trim();
    if (!email) return null;

    return {
      user: {
        email,
        name: parsed.user?.name?.trim() || nameFromEmail(email),
      },
      connection:
        parsed.connection === "connected" || parsed.connection === "skipped"
          ? parsed.connection
          : null,
      signedInAt: typeof parsed.signedInAt === "number" ? parsed.signedInAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export function saveAiSession(session: AiSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable — keep the session in memory */
  }
}

export function clearAiSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function hasSeenAiGuide(): boolean {
  try {
    return localStorage.getItem(GUIDE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markAiGuideSeen(): void {
  try {
    localStorage.setItem(GUIDE_KEY, "1");
  } catch {
    /* ignore */
  }
}
