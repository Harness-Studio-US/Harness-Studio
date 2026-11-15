import { legalVersion } from "../data/legal";

const LEGACY_SESSION_KEY = "harness-ai-session-v1";
const LEGAL_KEY = "harness-copilot-legal-v1";
const GUIDE_KEY = "harness-copilot-guide-v1";

/**
 * Older builds stored a demo email address in localStorage. Remove it on load;
 * Harness Copilot no longer has accounts or sign-in credentials.
 */
export function removeLegacyCredentials(): void {
  try {
    localStorage.removeItem(LEGACY_SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function hasAcceptedCopilotTerms(): boolean {
  try {
    return localStorage.getItem(LEGAL_KEY) === legalVersion;
  } catch {
    return false;
  }
}

export function acceptCopilotTerms(): void {
  try {
    localStorage.setItem(LEGAL_KEY, legalVersion);
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
