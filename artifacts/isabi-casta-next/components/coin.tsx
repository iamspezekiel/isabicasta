"use client";

import { cn } from "@/lib/cn";
import { coinLabels, type CoinMode } from "@/lib/coin";

export interface CoinProps {
  mode: CoinMode;
  /** Which face has landed, or null before the first flip. */
  outcome: "first" | "second" | null;
  flipping: boolean;
  onFlip: () => void;
}

/**
 * A 116px coin that spins on the Y axis.
 *
 * The faces keep their own gold gradients in both themes on purpose: a gold coin
 * reads as gold on any background, and re-toning it for dark mode would turn a
 * physical object into a UI surface.
 */
export function Coin({ mode, outcome, flipping, onFlip }: CoinProps) {
  const labels = coinLabels(mode);
  const landed = outcome ? labels[outcome] : null;
  const rotation = outcome === "second" ? 180 : 0;

  return (
    <div className="relative mt-7 grid h-[172px] place-items-center [perspective:800px]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute size-[184px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--glow) 0%, transparent 72%)",
        }}
      />

      <button
        type="button"
        onClick={onFlip}
        aria-label={landed ? `Coin landed on ${landed}` : "Flip the coin"}
        className="relative size-[116px] rounded-full [transform-style:preserve-3d]"
      >
        <span
          className={cn(
            "relative block size-full [transform-style:preserve-3d]",
            flipping && "coin-flipping",
          )}
          style={!flipping ? { transform: `rotateY(${rotation}deg)` } : undefined}
        >
          <span className="absolute inset-0 grid place-items-center rounded-full border-4 border-accent bg-[linear-gradient(145deg,#f3e6c4,#d4b06a)] font-serif text-[40px] font-extrabold text-[#2c4030] [backface-visibility:hidden]">
            {labels.firstLetter}
          </span>
          <span className="absolute inset-0 grid place-items-center rounded-full border-4 border-accent bg-[linear-gradient(145deg,#efe6d4,#c9b48a)] font-serif text-[40px] font-extrabold text-[#3d5a40] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            {labels.secondLetter}
          </span>
        </span>
      </button>
    </div>
  );
}
