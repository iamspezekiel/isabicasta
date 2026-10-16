"use client";

import { useCallback, useEffect, useState } from "react";

import {
  appendHistory,
  clearStoredHistory,
  loadHistory,
  makeHistoryEntry,
  type HistoryEntry,
  type NewHistoryEntry,
} from "@/lib/history";

export interface UseHistoryResult {
  entries: HistoryEntry[];
  ready: boolean;
  /** Records a decision. Returns the next list so the caller can react to it. */
  record: (input: NewHistoryEntry) => HistoryEntry[];
  clear: () => void;
}

/**
 * The app's only "data source": local storage. It is read in an effect, never
 * during render, so the server and the first client render agree.
 */
export function useHistory(): UseHistoryResult {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEntries(loadHistory());
    setReady(true);
  }, []);

  const record = useCallback((input: NewHistoryEntry) => {
    const entry = makeHistoryEntry(input);
    const next = appendHistory(entry).entries;
    setEntries(next);
    return next;
  }, []);

  const clear = useCallback(() => {
    clearStoredHistory();
    setEntries([]);
  }, []);

  return { entries, ready, record, clear };
}
