import { coinLabels, type CoinMode } from "@/lib/coin";
import { SLIDE_COUNT } from "@/lib/constants";
import type { HistoryEntry } from "@/lib/history";

export function formatSlidePosition(index: number): string {
  return `Slide ${index + 1} of ${SLIDE_COUNT}`;
}

export const formatModeCaption = (mode: CoinMode): string =>
  `Mode: ${coinLabels(mode).modeLabel}`;

export const formatCoinCaption = (mode: CoinMode): string =>
  `${coinLabels(mode).first} · the first face`;

export const formatFlipMeta = (mode: CoinMode): string =>
  `${coinLabels(mode).modeLabel} flip`;

export const formatLotsMeta = (optionCount: number): string =>
  `Cast lots · ${optionCount} option${optionCount === 1 ? "" : "s"}`;

export function formatValidOptions(count: number): string {
  return `${count} valid option${count === 1 ? "" : "s"}`;
}

/** Local wall-clock time, e.g. "9:14 AM". */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "Today" / "Yesterday" / "Oct 14" — real structure for grouping the record. */
export function formatDayLabel(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

  const daysApart = Math.round(
    (startOfDay(now) - startOfDay(date)) / 86_400_000,
  );

  if (daysApart === 0) return "Today";
  if (daysApart === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * The factual second line of a history row, split so the markup can render the
 * timestamp as a real `<time>` element.
 */
export function formatHistoryMetaParts(entry: HistoryEntry): {
  label: string;
  time: string;
} {
  const label =
    entry.type === "coin"
      ? entry.modeLabel
      : `Cast lots · ${entry.options.length} option${entry.options.length === 1 ? "" : "s"}`;

  return { label, time: formatTime(entry.timestamp) };
}

/**
 * Kept separate so the home screen can render the outcome in a heavier weight
 * than the rest of the line.
 */
export function formatLastResultParts(entry: HistoryEntry): {
  prefix: string;
  outcome: string;
  meta: string;
} {
  const mode = entry.type === "coin" ? entry.modeLabel : "Cast lots";
  const time = formatTime(entry.timestamp);
  return {
    prefix: "Last:",
    outcome: entry.result,
    meta: time ? `${mode} · ${time}` : mode,
  };
}

export function formatClearPrompt(count: number): string {
  return `Clear ${count} saved ${count === 1 ? "entry" : "entries"}? This can’t be undone.`;
}
