import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Brand } from "@/components/brand";

export interface AppHeaderProps {
  /** Contextual right-hand control: the theme toggle on Home, a back link elsewhere. */
  right?: ReactNode;
}

/** The 56px bar every screen sits under. */
export function AppHeader({ right }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-hairline bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-[420px] items-center justify-between gap-3 px-5">
        <Brand />
        {right}
      </div>
    </header>
  );
}

/** The "← Home" control used by every sub-screen. */
export function BackHomeLink() {
  return (
    <Link
      href="/"
      className="-mr-2 flex min-h-11 items-center gap-1.5 rounded-btn px-2 text-[15px] text-muted transition-colors hover:text-ink"
    >
      <IconArrowLeft aria-hidden="true" size={18} stroke={1.75} />
      Home
    </Link>
  );
}
