import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface NoticeProps {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * A small icon-plus-sentence line. Used for the app's local-only promises, so it
 * keeps real contrast rather than sinking into grey boilerplate.
 */
export function Notice({ icon, children, className }: NoticeProps) {
  return (
    <p className={cn("flex items-start gap-2 text-[13.5px] text-muted", className)}>
      <span aria-hidden="true" className="mt-px shrink-0 text-[18px] leading-5">
        {icon}
      </span>
      <span className="leading-5">{children}</span>
    </p>
  );
}
