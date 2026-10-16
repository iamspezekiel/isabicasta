import Link from "next/link";
import { IconCoin } from "@tabler/icons-react";

/**
 * The brand mark. The app previously used a ✦ glyph and emoji; both are gone in
 * favour of a real line icon.
 */
export function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-btn text-ink"
      aria-label="IsabiCasta home"
    >
      <IconCoin
        aria-hidden="true"
        size={20}
        stroke={1.75}
        className="text-accent"
      />
      <span className="font-serif text-[17px] font-semibold leading-6 tracking-[-0.01em]">
        IsabiCasta
      </span>
    </Link>
  );
}
