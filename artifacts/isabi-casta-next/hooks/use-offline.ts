"use client";

import { createContext, useContext } from "react";

export type OfflineState = "ready" | "preparing" | "unavailable";

export interface OfflineContextValue {
  /** Whether the app shell is genuinely cached and usable without a connection. */
  state: OfflineState;
  /** The browser's own connectivity signal — context, never proof of readiness. */
  online: boolean;
}

export const OfflineContext = createContext<OfflineContextValue>({
  state: "preparing",
  online: true,
});

export function useOfflineStatus(): OfflineContextValue {
  return useContext(OfflineContext);
}
