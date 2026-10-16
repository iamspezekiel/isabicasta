import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * The one lifted surface a screen is allowed. Everything else separates with
 * whitespace and hairlines.
 */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-panel border border-hairline bg-surface px-7 py-8 shadow-panel",
        className,
      )}
    >
      {children}
    </div>
  );
}
