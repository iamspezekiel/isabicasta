import type { CoinMode } from "@/lib/coin";

/** Recent decisions kept in local storage before the oldest are dropped. */
export const HISTORY_CAP = 50;

/** Number of onboarding slides. */
export const SLIDE_COUNT = 6;

/** Coin flip animation duration — must match `isabi-coin-flip` in globals.css. */
export const FLIP_MS = 1350;

/** The brief pause before a cast-lots draw is revealed. */
export const CAST_MS = 650;

/** The app opens on the Yes/No labelling of the coin. */
export const DEFAULT_COIN_MODE: CoinMode = "yesno";
