"use client";

import { cn } from "@/lib/cn";
import type { CoinMode } from "@/lib/coin";
import { coinLabels } from "@/lib/coin";

export interface SegmentedModeToggleProps {
  value: CoinMode;
  onChange: (mode: CoinMode) => void;
  /** Locked while a flip is running, so the faces cannot change mid-air. */
  disabled?: boolean;
}

const SEGMENT =
  "flex h-11 flex-1 items-center justify-center rounded-full text-[14px] leading-5 transition-colors";

/**
 * A mode switch, not a navigation tab: it sits above the coin so you know what
 * the faces mean before flipping, and it relabels everything downstream.
 */
export function SegmentedModeToggle({
  value,
  onChange,
  disabled = false,
}: SegmentedModeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Coin face labels"
      className={cn(
        "mt-5 flex gap-1 rounded-full border border-hairline bg-primary-tint p-1",
        disabled && "opacity-60",
      )}
    >
      {(["yesno", "headsTails"] as const).map((mode) => {
        const selected = value === mode;
        return (
          <button
            key={mode}
            type="button"
            aria-pressed={selected}
            disabled={disabled}
            onClick={() => onChange(mode)}
            className={cn(
              SEGMENT,
              selected
                ? "border border-hairline bg-surface font-semibold text-ink shadow-chip"
                : "border border-transparent font-medium text-muted hover:text-ink",
            )}
          >
            {coinLabels(mode).modeLabel}
          </button>
        );
      })}
    </div>
  );
}
