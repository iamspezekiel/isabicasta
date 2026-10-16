"use client";

import { IconBook, IconHistory, IconWifiOff } from "@tabler/icons-react";

import { AppHeader, BackHomeLink } from "@/components/app-header";
import { ClearHistoryControl } from "@/components/clear-history-control";
import { OfflineStatus } from "@/components/offline-status";
import { Body, Divider, Section } from "@/components/section";
import { useHistory } from "@/hooks/use-history";
import { SLIDES } from "@/lib/slides";

const DISCLAIMER = SLIDES[SLIDES.length - 1]?.body ?? "";

/**
 * The honest version of "private by design": what is stored, where, what
 * happens when it is cleared, and the real state of offline access. The
 * disclaimer lives here too, so someone who skipped the intro can still read it.
 */
export default function LocalPage() {
  const { entries, clear } = useHistory();

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader right={<BackHomeLink />} />

      <main className="mx-auto w-full max-w-[420px] px-5 pb-14 pt-7">
        <h1 className="font-serif text-[24px] font-semibold leading-[30px] tracking-[-0.02em] text-display">
          How IsabiCasta works
        </h1>

        <Section icon={<IconWifiOff size={20} stroke={1.75} />} heading="Works offline">
          <Body>
            Once it has loaded, the app keeps working with no connection. You can
            flip a coin or cast lots even when you are offline.
          </Body>
        </Section>
        <OfflineStatus />

        <Divider />

        <Section
          icon={<IconHistory size={20} stroke={1.75} />}
          heading="Saved in this browser"
        >
          <Body>
            Your history is kept in this browser’s local storage, on this device
            only. There is no account, and nothing you choose is uploaded
            anywhere.
          </Body>
          <Body>Clearing this site’s data removes it.</Body>
        </Section>
        <ClearHistoryControl count={entries.length} onClear={clear} variant="explained" />

        <Divider />

        <Section icon={<IconBook size={20} stroke={1.75} />} heading="A tool, not a prophecy">
          <Body>{DISCLAIMER}</Body>
        </Section>

        <p className="pt-10 text-[13.5px] leading-5 text-muted">
          No account, no ads, no analytics.
        </p>
      </main>
    </div>
  );
}
