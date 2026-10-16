"use client";

import { useCallback, useEffect, useState } from "react";

import { OfflineProvider } from "@/components/offline-provider";
import { OnboardingSlider } from "@/components/onboarding-slider";
import { isOnboarded, markOnboarded } from "@/lib/history";

/**
 * The app shell. It owns two things and nothing else:
 *
 *  1. the onboarding gate — whether the intro or the app is shown;
 *  2. mounting the offline provider for everything below it.
 *
 * The gate reads persisted state in an effect, never during render, so the
 * first client render matches the server render exactly. Until the check has
 * happened we paint the plain page background, which means the intro never
 * flashes in front of a returning visitor.
 */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(true);

  useEffect(() => {
    setDone(isOnboarded());
    setReady(true);
  }, []);

  const complete = useCallback(() => {
    markOnboarded();
    setDone(true);
  }, []);

  if (!ready) {
    return <div className="min-h-dvh bg-canvas" aria-hidden="true" />;
  }

  if (!done) {
    return <OnboardingSlider onComplete={complete} />;
  }

  return (
    <OfflineProvider>
      <div className="min-h-dvh bg-canvas">{children}</div>
    </OfflineProvider>
  );
}
