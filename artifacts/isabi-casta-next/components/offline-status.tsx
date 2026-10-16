"use client";

import { IconCheck } from "@tabler/icons-react";

import { useOfflineStatus } from "@/hooks/use-offline";

/**
 * Reports what is actually true about offline access.
 *
 * All three states are always worded, never colour-coded alone, and the active
 * one is only "ready" once the cache genuinely holds the shell. The previous
 * design had no service worker at all, so asserting readiness would have been a
 * promise the app could not keep.
 */
export function OfflineStatus() {
  const { state } = useOfflineStatus();

  const ready = state === "ready";

  return (
    <div className="mt-5 space-y-2 pl-8">
      {ready ? (
        <p className="flex items-start gap-2 text-[14px] font-medium leading-5">
          <span
            aria-hidden="true"
            className="mt-px shrink-0 text-[18px] leading-none text-success"
          >
            <IconCheck size={18} stroke={2} />
          </span>
          <span>App cached — ready to use offline.</span>
        </p>
      ) : null}

      {state === "preparing" ? (
        <p className="text-[14px] font-medium leading-5">Preparing offline access…</p>
      ) : null}

      {state === "unavailable" ? (
        <p className="text-[14px] font-medium leading-5">
          Offline access unavailable — you’ll need a connection to reload.
        </p>
      ) : null}

      {/* The remaining states stay visible so the contract is documented. */}
      {ready ? (
        <p className="text-[13px] leading-[18px] text-muted-soft">
          Offline access unavailable — you’ll need a connection to reload.
        </p>
      ) : null}
      {state === "unavailable" ? (
        <p className="text-[13px] leading-[18px] text-muted-soft">
          Preparing offline access…
        </p>
      ) : null}
    </div>
  );
}
