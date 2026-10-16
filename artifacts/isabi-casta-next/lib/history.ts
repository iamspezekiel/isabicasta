import { coinLabels, type CoinMode } from "@/lib/coin";
import { HISTORY_CAP } from "@/lib/constants";

export type DrawType = "coin" | "lots";

export interface HistoryEntry {
  id: string;
  type: DrawType;
  /** What was drawn: "Yes" | "No" | "Heads" | "Tails", or the chosen option. */
  result: string;
  /** For a coin flip, the two faces. For a lots draw, the options that were in play. */
  options: string[];
  /**
   * The labelling used, e.g. "Yes / No flip", "Heads / Tails flip" or "Cast lots".
   * This is what stops a Yes result being recorded as "Heads".
   */
  modeLabel: string;
  /** ISO 8601. */
  timestamp: string;
}

/** What a flow hands over, before id/timestamp/modeLabel are derived. */
export type NewHistoryEntry =
  | { type: "coin"; result: string; mode: CoinMode; faces: [string, string] }
  | { type: "lots"; result: string; options: string[] };

export const HISTORY_KEY = "isabi_history";
export const ONBOARDING_KEY = "isabi_onboarding_done";
export const ONBOARDING_SLIDE_KEY = "isabi_onboarding_slide";

/**
 * Every read and write goes through here. Storage can be unavailable (private
 * browsing, storage disabled, a corrupt value written by an older version), and
 * a decision app must degrade quietly rather than throw at the user.
 */
function readRaw(key: string): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): boolean {
  try {
    if (typeof window === "undefined") return false;
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeRaw(key: string): boolean {
  try {
    if (typeof window === "undefined") return false;
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function makeHistoryEntry(input: NewHistoryEntry): HistoryEntry {
  const base = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };

  if (input.type === "coin") {
    return {
      ...base,
      type: "coin",
      result: input.result,
      options: [...input.faces],
      modeLabel: `${coinLabels(input.mode).modeLabel} flip`,
    };
  }

  return {
    ...base,
    type: "lots",
    result: input.result,
    options: [...input.options],
    modeLabel: "Cast lots",
  };
}

/** Never throws: anything unreadable resolves to an empty list. */
export function loadHistory(): HistoryEntry[] {
  const raw = readRaw(HISTORY_KEY);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryEntry).slice(0, HISTORY_CAP);
  } catch {
    return [];
  }
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    (entry.type === "coin" || entry.type === "lots") &&
    typeof entry.result === "string" &&
    Array.isArray(entry.options) &&
    typeof entry.modeLabel === "string" &&
    typeof entry.timestamp === "string"
  );
}

/** Prepends a decision, trims to the cap and persists. Returns the next list. */
export function appendHistory(entry: HistoryEntry): {
  entries: HistoryEntry[];
  persisted: boolean;
} {
  const entries = [entry, ...loadHistory()].slice(0, HISTORY_CAP);
  const persisted = writeRaw(HISTORY_KEY, JSON.stringify(entries));
  return { entries, persisted };
}

export function clearStoredHistory(): { persisted: boolean } {
  return { persisted: removeRaw(HISTORY_KEY) };
}

export function isOnboarded(): boolean {
  return readRaw(ONBOARDING_KEY) === "true";
}

export function markOnboarded(): boolean {
  return writeRaw(ONBOARDING_KEY, "true");
}

/** Resumes mid-intro rather than restarting it after a refresh. */
export function readOnboardingSlide(slideCount: number): number {
  const raw = readRaw(ONBOARDING_SLIDE_KEY);
  if (!raw) return 0;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed >= slideCount) return 0;
  return parsed;
}

export function writeOnboardingSlide(index: number): boolean {
  return writeRaw(ONBOARDING_SLIDE_KEY, String(index));
}
