"use client";

import { IconRefresh, IconWifiOff } from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";

import { AppHeader, BackHomeLink } from "@/components/app-header";
import { Coin } from "@/components/coin";
import { ResultCard } from "@/components/result-card";
import { SegmentedModeToggle } from "@/components/segmented-mode-toggle";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/use-history";
import { coinLabels, otherCoinMode, type CoinMode } from "@/lib/coin";
import { DEFAULT_COIN_MODE, FLIP_MS } from "@/lib/constants";
import { formatCoinCaption, formatFlipMeta, formatModeCaption } from "@/lib/format";
import { randomUnit } from "@/lib/random";

export default function CoinPage() {
  const { record } = useHistory();
  const [mode, setMode] = useState<CoinMode>(DEFAULT_COIN_MODE);
  const [flipping, setFlipping] = useState(false);
  const [outcome, setOutcome] = useState<"first" | "second" | null>(null);
  const [flipCount, setFlipCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flip = useCallback(() => {
    if (flipping) return;

    setFlipping(true);
    setOutcome(null);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const side = randomUnit() < 0.5 ? "first" : "second";
      setOutcome(side);
      setFlipping(false);
      setFlipCount((count) => count + 1);

      const labels = coinLabels(mode);
      record({
        type: "coin",
        result: side === "first" ? labels.first : labels.second,
        mode,
        faces: [labels.first, labels.second],
      });
    }, FLIP_MS);
  }, [flipping, mode, record]);

  const labels = coinLabels(mode);
  const landed = outcome ? labels[outcome] : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader right={<BackHomeLink />} />

      <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col px-5 pb-7 pt-7">
        <h1 className="font-serif text-[24px] font-semibold leading-[30px] tracking-[-0.01em] text-display">
          Flip a Coin
        </h1>
        <p className="mt-2 text-[15px] leading-6 text-muted">
          Yes / No and Heads / Tails are two labels for the same fair flip.
        </p>

        <SegmentedModeToggle value={mode} onChange={setMode} disabled={flipping} />

        <p className="mt-2 text-center text-[13px] leading-[18px] text-muted">
          {formatModeCaption(mode)}
        </p>

        <Coin mode={mode} outcome={outcome} flipping={flipping} onFlip={flip} />

        <p className="text-center text-[13px] leading-[18px] text-muted">
          {formatCoinCaption(mode)}
        </p>

        {landed ? (
          <ResultCard
            key={flipCount}
            className="mt-7"
            outcome={landed}
            meta={formatFlipMeta(mode)}
          />
        ) : null}

        <Button
          fullWidth
          className="mt-6"
          disabled={flipping}
          onClick={flip}
          icon={<IconRefresh aria-hidden="true" size={18} stroke={1.75} />}
        >
          {flipping ? "Flipping…" : landed ? "Try again" : "Flip coin"}
        </Button>

        <div className="mt-2 flex justify-center">
          <Button
            variant="ghost"
            size="md"
            className="px-3 font-medium"
            disabled={flipping}
            onClick={() => {
              setMode(otherCoinMode(mode));
              flip();
            }}
          >
            Switch to {coinLabels(otherCoinMode(mode)).modeLabel}
          </Button>
        </div>

        <p className="mt-auto flex items-center justify-center gap-2 pt-7 text-[13.5px] leading-5 text-muted">
          <IconWifiOff aria-hidden="true" size={18} stroke={1.75} />
          Nothing leaves your device.
        </p>
      </main>
    </div>
  );
}
