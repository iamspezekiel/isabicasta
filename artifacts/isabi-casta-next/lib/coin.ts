export type CoinMode = "yesno" | "headsTails";

export const COIN_MODES: readonly CoinMode[] = ["yesno", "headsTails"] as const;

export interface CoinLabels {
  /** The first face read as an answer, e.g. "Yes". */
  first: string;
  /** The second face read as an answer, e.g. "No". */
  second: string;
  /** The letter engraved on the first face. */
  firstLetter: string;
  /** The letter engraved on the second face. */
  secondLetter: string;
  /** The labelling, e.g. "Yes / No" — recorded in history so a Yes result is never called "Heads". */
  modeLabel: string;
}

const LABELS: Record<CoinMode, CoinLabels> = {
  yesno: {
    first: "Yes",
    second: "No",
    firstLetter: "Y",
    secondLetter: "N",
    modeLabel: "Yes / No",
  },
  headsTails: {
    first: "Heads",
    second: "Tails",
    firstLetter: "H",
    secondLetter: "T",
    modeLabel: "Heads / Tails",
  },
};

/**
 * One source of truth for everything that changes when the labelling changes:
 * the coin faces, the caption under the coin, the outcome and the history meta.
 */
export function coinLabels(mode: CoinMode): CoinLabels {
  return LABELS[mode];
}

/** The labelling that is *not* currently selected, for the switch affordance. */
export function otherCoinMode(mode: CoinMode): CoinMode {
  return mode === "yesno" ? "headsTails" : "yesno";
}
