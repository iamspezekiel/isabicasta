"use client";

import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatClearPrompt } from "@/lib/format";

export interface ClearHistoryControlProps {
  count: number;
  onClear: () => void;
  /** The longer explanation used on the "How it works" screen. */
  variant?: "compact" | "explained";
}

/**
 * Clearing is destructive and irreversible, so the trigger is a plain text
 * action placed away from the heading — a stray tap near a title must never be
 * able to erase someone's record — and it always asks first, inline, with no
 * modal chrome.
 */
export function ClearHistoryControl({
  count,
  onClear,
  variant = "compact",
}: ClearHistoryControlProps) {
  const [confirming, setConfirming] = useState(false);

  if (count === 0) return null;

  if (!confirming) {
    return (
      <div className={variant === "explained" ? "mt-3" : "mt-2"}>
        <Button
          variant="ghost"
          size="md"
          className="-ml-2 px-2 font-medium text-danger hover:bg-danger-tint hover:text-danger-hover"
          icon={<IconTrash aria-hidden="true" size={18} stroke={1.75} />}
          onClick={() => setConfirming(true)}
        >
          {variant === "explained" ? "Clear saved history" : "Clear all"}
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-hairline pt-4">
      <p className="text-[14px] leading-5">{formatClearPrompt(count)}</p>
      <div className="mt-1 flex items-center gap-4">
        <Button
          variant="ghost"
          size="md"
          className="px-2 font-normal"
          onClick={() => setConfirming(false)}
        >
          Cancel
        </Button>
        <Button
          variant="ghost"
          size="md"
          className="px-2 font-medium text-danger hover:bg-danger-tint hover:text-danger-hover"
          onClick={() => {
            onClear();
            setConfirming(false);
          }}
        >
          Clear history
        </Button>
      </div>
    </div>
  );
}
