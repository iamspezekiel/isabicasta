import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface IconButtonProps extends Omit<ComponentProps<"button">, "children"> {
  /** Required: an icon-only control has no text for a screen reader. */
  label: string;
  icon: ReactNode;
  className?: string;
}

/** A 40px round, icon-only tap target. */
export function IconButton({ label, icon, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:bg-row-hover hover:text-ink",
        className,
      )}
      {...rest}
    >
      {icon}
    </button>
  );
}
