import { IconWifiOff } from "@tabler/icons-react";

import { HistoryRow } from "@/components/history-row";
import type { HistoryEntry } from "@/lib/history";

export interface HistoryGroup {
  label: string;
  items: HistoryEntry[];
}

export interface HistoryListProps {
  groups: HistoryGroup[];
}

/**
 * A dense, factual record grouped by day. Separation comes from whitespace
 * rhythm inside a group and generous space above each day label.
 */
export function HistoryList({ groups }: HistoryListProps) {
  return (
    <>
      {groups.map((group) => (
        <section key={group.label}>
          <p className="mt-7 text-[13px] font-medium leading-[18px] text-muted">
            {group.label}
          </p>
          <ul role="list" className="mt-1">
            {group.items.map((entry) => (
              <HistoryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        </section>
      ))}

      <p className="mt-9 flex items-start gap-2.5 border-t border-hairline pt-5 text-[13.5px] leading-5 text-muted">
        <span aria-hidden="true" className="mt-px shrink-0">
          <IconWifiOff size={18} stroke={1.75} />
        </span>
        <span>History is stored in this browser. Clearing site data removes it.</span>
      </p>
    </>
  );
}
