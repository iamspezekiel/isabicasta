"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  OfflineContext,
  type OfflineContextValue,
  type OfflineState,
} from "@/hooks/use-offline";

const CACHE_PREFIX = "isabi-";
/** The shell must hold at least its pages before we may claim readiness. */
const SHELL_MIN_ENTRIES = 4;
const READY_MESSAGE = "isabi-cache-ready";
/**
 * How long "preparing" may stand before it becomes a false statement. If the
 * shell has not cached by then, something is genuinely in the way — a blocked
 * service worker, a private window, a hostile network — and saying so is better
 * than implying that offline access is just around the corner.
 */
const PREPARING_TIMEOUT_MS = 10_000;

/** Registers the worker exactly once, no matter how often this mounts. */
let registrationPromise: Promise<ServiceWorkerRegistration | undefined> | null =
  null;

function canUseServiceWorker(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return "serviceWorker" in navigator && window.isSecureContext;
}

async function shellIsCached(): Promise<boolean> {
  try {
    if (typeof caches === "undefined") return false;
    const names = await caches.keys();
    const cacheName = names.find((name) => name.startsWith(CACHE_PREFIX));
    if (!cacheName) return false;
    const keys = await (await caches.open(cacheName)).keys();
    return keys.length >= SHELL_MIN_ENTRIES;
  } catch {
    return false;
  }
}

/**
 * Reports the *actual* offline readiness of the app.
 *
 * `navigator.onLine` says nothing about whether the shell is cached, so being
 * online is never treated as proof of readiness: the state only becomes "ready"
 * once Cache Storage confirms the shell is really there and a worker controls
 * the page. If that never happens, the app says so rather than pretending.
 */
export function OfflineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OfflineState>("preparing");
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let settling: ReturnType<typeof setTimeout> | null = null;

    setOnline(navigator.onLine);

    if (!canUseServiceWorker()) {
      setState("unavailable");
      return;
    }

    const evaluate = async () => {
      const controlling = Boolean(navigator.serviceWorker.controller);
      const cached = await shellIsCached();
      if (cancelled) return false;

      if (cached && controlling) {
        setState("ready");
        return true;
      }
      return false;
    };

    const register = async () => {
      setState("preparing");

      try {
        registrationPromise ??= navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        const registration = await registrationPromise;

        // A blocked or disabled service worker can resolve with nothing at all.
        if (!registration) {
          if (!cancelled) setState("unavailable");
          return;
        }
      } catch {
        if (!cancelled) setState("unavailable");
        return;
      }

      if (await evaluate()) return;

      // Poll briefly: activation and the cache fill happen just after register.
      const startedAt = Date.now();
      settling = setInterval(async () => {
        if (await evaluate()) {
          if (settling) clearInterval(settling);
          return;
        }
        if (Date.now() - startedAt > PREPARING_TIMEOUT_MS) {
          if (settling) clearInterval(settling);
          if (!cancelled) setState("unavailable");
        }
      }, 1000);
    };

    const onControllerChange = () => void evaluate();
    const onOnlineChange = () => {
      setOnline(navigator.onLine);
      void evaluate();
    };
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string } | null;
      if (data?.type === READY_MESSAGE) void evaluate();
    };

    if (document.readyState === "complete") {
      void register();
    } else {
      window.addEventListener("load", register, { once: true });
    }

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );
    navigator.serviceWorker.addEventListener("message", onMessage);
    window.addEventListener("online", onOnlineChange);
    window.addEventListener("offline", onOnlineChange);

    return () => {
      cancelled = true;
      if (settling) clearInterval(settling);
      window.removeEventListener("load", register);
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
      navigator.serviceWorker.removeEventListener("message", onMessage);
      window.removeEventListener("online", onOnlineChange);
      window.removeEventListener("offline", onOnlineChange);
    };
  }, []);

  const value = useMemo<OfflineContextValue>(
    () => ({ state, online }),
    [state, online],
  );

  return (
    <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
  );
}
