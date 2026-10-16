"use client";

import { IconRefresh, IconWifiOff } from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";

import { AppHeader, BackHomeLink } from "@/components/app-header";
import { OptionsForm } from "@/components/options-form";
import { ResultCard } from "@/components/result-card";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/use-history";
import { CAST_MS } from "@/lib/constants";
import { formatLotsMeta } from "@/lib/format";
import { pickOne } from "@/lib/random";

export default function LotsPage() {
  const { record } = useHistory();
  const [casting, setCasting] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [drawn, setDrawn] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [castCount, setCastCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cast = useCallback(
    (options: string[]) => {
      if (casting) return;

      if (options.length < 2) {
        setError("Please enter at least two options (one per line).");
        return;
      }

      setError(null);
      setCasting(true);

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const picked = pickOne(options);
        setCasting(false);

        if (!picked) {
          setError("Please enter at least two options (one per line).");
          return;
        }

        setSelected(picked);
        setDrawn(options);
        setCastCount((count) => count + 1);
        record({ type: "lots", result: picked, options });
      }, CAST_MS);
    },
    [casting, record],
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader right={<BackHomeLink />} />

      <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col px-5 pb-7 pt-7">
        <h1 className="font-serif text-[24px] font-semibold leading-[30px] tracking-[-0.01em] text-display">
          Cast Lots
        </h1>
        <p className="mt-2 text-[15px] leading-6 text-muted">
          Enter your options, one per line. The lot will choose one.
        </p>

        {selected === null ? (
          <OptionsForm
            casting={casting}
            error={error}
            initialText={draft}
            onCast={(options) => {
              setDraft(options.join("\n"));
              cast(options);
            }}
          />
        ) : (
          <>
            <ResultCard
              key={castCount}
              className="mt-7"
              outcome={selected}
              meta={formatLotsMeta(drawn.length)}
            />

            <div className="mt-6 flex flex-col gap-1">
              <Button
                fullWidth
                onClick={() => cast(drawn)}
                icon={<IconRefresh aria-hidden="true" size={18} stroke={1.75} />}
              >
                Try again
              </Button>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                className="font-medium text-display"
                onClick={() => {
                  setSelected(null);
                  setError(null);
                }}
              >
                Edit options
              </Button>
            </div>

            <p className="mt-8 flex items-center justify-center gap-2 text-[13.5px] leading-5 text-muted">
              <IconWifiOff aria-hidden="true" size={18} stroke={1.75} />
              Saved in this browser only.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
