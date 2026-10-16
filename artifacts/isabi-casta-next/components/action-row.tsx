import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface ActionRowProps {
  icon: ReactNode;
  title: string;
  /** The one-line consequence preview that makes this action distinguishable. */
  preview: string;
  href: string;
  tone: "green" | "gold";
}

/**
 * A large, unboxed action row.
 *
 * The previous design rendered the two choices as identical bordered cards with
 * emoji icons, which made them indistinguishable at a glance and implied a
 * heavier UI than this tool has. These rows separate with whitespace and carry
 * equal weight, and their previews are what tell them apart.
 */
export function ActionRow({ icon, title, preview, href, tone }: ActionRowProps) {
  return (
    <Link
      href={href}
      className="flex min-h-[76px] w-full items-center gap-4 rounded-btn py-4 pr-1 transition-colors hover:bg-row-hover"
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full",
          tone === "green" ? "bg-chip-green text-chip-green-ink" : "bg-chip-gold text-chip-gold-ink",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold leading-6 text-ink">
          {title}
        </span>
        <span className="mt-0.5 block text-[15px] leading-6 text-muted">
          {preview}
        </span>
      </span>
      <IconChevronRight
        aria-hidden="true"
        size={20}
        stroke={1.75}
        className="shrink-0 text-muted-soft"
      />
    </Link>
  );
}
