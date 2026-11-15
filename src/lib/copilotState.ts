import { legalVersion } from "../data/legal";

const LEGACY_SESSION_KEY = "harness-ai-session-v1";
const LEGAL_KEY = "harness-copilot-legal-v1";
const GUIDE_KEY = "harness-copilot-guide-v1";

/**
 * Older builds stored a demo email address in localStorage. Remove that legacy
 * value on load. The current app uses Firebase Authentication, which manages its
 * own sign-in state.
 */
export function removeLegacyCredentials(): void {
  try {
    localStorage.removeItem(LEGACY_SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
}

const scopedKey = (base: string, userId?: string) =>
  userId ? `${base}:${userId}` : base;

export function hasAcceptedCopilotTerms(userId?: string): boolean {
  try {
    return localStorage.getItem(scopedKey(LEGAL_KEY, userId)) === legalVersion;
  } catch {
    return false;
  }
}

export function acceptCopilotTerms(userId?: string): void {
  try {
    localStorage.setItem(scopedKey(LEGAL_KEY, userId), legalVersion);
  } catch {
    /* storage unavailable — continue for this visit */
  }
}

export function hasSeenCopilotGuide(): boolean {
  try {
    return localStorage.getItem(GUIDE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markCopilotGuideSeen(): void {
  try {
    localStorage.setItem(GUIDE_KEY, "1");
  } catch {
    /* ignore */
  }
}
