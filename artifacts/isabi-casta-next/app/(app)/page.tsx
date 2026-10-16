"use client";

import Link from "next/link";
import {
  IconChevronRight,
  IconCoin,
  IconHistory,
  IconList,
  IconWifiOff,
} from "@tabler/icons-react";

import { ActionRow } from "@/components/action-row";
import { AppHeader } from "@/components/app-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { useHistory } from "@/hooks/use-history";
import { formatLastResultParts } from "@/lib/format";

/**
 * Home is a decision launcher, not a dashboard: the two actions dominate the
 * first viewport, the last result is one quiet line, and the local-only promise
 * is a legible statement rather than a footer afterthought.
 */
export default function HomePage() {
  const { entries, ready } = useHistory();
  const last = entries[0];
  const lastParts = last ? formatLastResultParts(last) : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader right={<ThemeToggle />} />

      <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col px-5 pb-8 pt-7">
        <h1 className="font-serif text-[19px] font-semibold leading-7 text-ink">
          A simple way to decide when you are stuck.
        </h1>
        <p className="mt-1 text-[15px] leading-6 text-muted">
          Inspired by the biblical practice of casting lots.
        </p>

        <div className="mt-6">
          <ActionRow
            href="/coin"
            tone="green"
            icon={<IconCoin size={22} stroke={1.75} />}
            title="Flip a Coin"
            preview="Yes / No, or Heads / Tails"
          />
          <div className="ml-15 border-t border-hairline" />
          <ActionRow
            href="/lots"
            tone="gold"
            icon={<IconList size={22} stroke={1.75} />}
            title="Cast Lots"
            preview="One option per line, then draw"
          />
        </div>

        {/* Only rendered once a decision has actually been made. */}
        {ready && lastParts ? (
          <Link
            href="/history"
            className="mt-6 flex min-h-11 items-center gap-2.5 rounded-btn py-2 transition-colors hover:bg-row-hover"
          >
            <IconHistory
              aria-hidden="true"
              size={18}
              stroke={1.75}
              className="shrink-0 text-muted"
            />
            <span className="min-w-0 flex-1 truncate text-[14px] text-muted">
              {lastParts.prefix}{" "}
              <span className="font-semibold text-ink">{lastParts.outcome}</span>
              {" · "}
              {lastParts.meta}
            </span>
            <span className="shrink-0 text-[14px] font-medium text-display">
              View all
            </span>
          </Link>
        ) : null}

        <div className="mt-auto pt-10">
          <div className="flex items-start gap-2.5 border-t border-hairline pt-5">
            <span aria-hidden="true" className="mt-px shrink-0">
              <IconWifiOff size={18} stroke={1.75} className="text-muted" />
            </span>
            <p className="text-[15px] leading-6 text-muted">
              Works offline. Nothing you type leaves this device.
            </p>
          </div>

          <Link
            href="/local"
            className="mt-1 inline-flex min-h-11 items-center gap-1 rounded-btn text-[15px] font-medium text-display transition-colors hover:bg-row-hover"
          >
            How this works
            <IconChevronRight aria-hidden="true" size={18} stroke={1.75} />
          </Link>
        </div>
      </main>
    </div>
  );
}
