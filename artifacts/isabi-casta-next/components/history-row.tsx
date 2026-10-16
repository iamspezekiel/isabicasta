import { IconCoin, IconList } from "@tabler/icons-react";
import { memo } from "react";

import { formatHistoryMetaParts } from "@/lib/format";
import type { HistoryEntry } from "@/lib/history";

export interface HistoryRowProps {
  entry: HistoryEntry;
}

/**
 * One record. Deliberately unboxed — no card, no border, no per-row fill and no
 * shadow — because a stack of bordered rows is exactly the treatment this screen
 * is trying to avoid. Rows are not interactive either: there is nothing to open.
 */
function HistoryRowBase({ entry }: HistoryRowProps) {
  const Icon = entry.type === "coin" ? IconCoin : IconList;
  const { label, time } = formatHistoryMetaParts(entry);

  return (
    <li className="flex items-start gap-3 py-[15px]">
      <Icon
        aria-hidden="true"
        size={18}
        stroke={1.75}
        className="mt-[3px] shrink-0 text-muted"
      />
      <div className="min-w-0 flex-1">
        <p className="break-words font-serif text-[18px] font-semibold leading-6 text-ink">
          {entry.result}
        </p>
        <p className="mt-1 text-[13px] leading-[18px] text-muted">
          {label}
          {time ? (
            <>
              {" · "}
              <time dateTime={entry.timestamp}>{time}</time>
            </>
          ) : null}
        </p>
      </div>
    </li>
  );
}

export const HistoryRow = memo(HistoryRowBase);
