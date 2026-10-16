"use client";

import { useMemo } from "react";

import { AppHeader, BackHomeLink } from "@/components/app-header";
import { ClearHistoryControl } from "@/components/clear-history-control";
import { EmptyHistory } from "@/components/empty-history";
import { HistoryList, type HistoryGroup } from "@/components/history-list";
import { useHistory } from "@/hooks/use-history";
import { formatDayLabel } from "@/lib/format";
import type { HistoryEntry } from "@/lib/history";

/** Groups consecutive entries under a day label, preserving order. */
function groupByDay(entries: HistoryEntry[]): HistoryGroup[] {
  const groups: HistoryGroup[] = [];

  for (const entry of entries) {
    const label = formatDayLabel(entry.timestamp);
    const current = groups[groups.length - 1];
    if (current && current.label === label) {
      current.items.push(entry);
    } else {
      groups.push({ label, items: [entry] });
    }
  }

  return groups;
}

export default function HistoryPage() {
  const { entries, ready, clear } = useHistory();
  const groups = useMemo(() => groupByDay(entries), [entries]);

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader right={<BackHomeLink />} />

      <main className="mx-auto w-full max-w-[420px] px-5 pb-10 pt-6">
        <h1 className="font-serif text-[24px] font-semibold leading-[30px] tracking-[-0.015em] text-display">
          Recent activity
        </h1>

        <ClearHistoryControl count={entries.length} onClear={clear} />

        {ready && entries.length === 0 ? <EmptyHistory /> : null}
        {entries.length > 0 ? <HistoryList groups={groups} /> : null}
      </main>
    </div>
  );
}
