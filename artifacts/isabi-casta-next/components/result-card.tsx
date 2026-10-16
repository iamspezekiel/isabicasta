import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export interface ResultCardProps {
  /** The drawn outcome, rendered as the dominant element. */
  outcome: string;
  /** The factual record line, e.g. "Cast lots · 3 options". */
  meta: string;
  /** The reserved congratulation. Off for outcomes that are not a completed choice. */
  encouraged?: boolean;
  className?: string;
}

/**
 * The outcome moment — the app's emotional peak, deliberately in a calm
 * register. It congratulates the act of deciding, never the outcome, and never
 * implies that a result reveals God's will. The gold glow is the entire
 * celebration budget: no badge, no ring, no confetti.
 */
export function ResultCard({
  outcome,
  meta,
  encouraged = true,
  className,
}: ResultCardProps) {
  return (
    <Card
      className={cn(
        "result-in relative overflow-hidden text-center",
        className,
      )}
    >
      <p className="text-[14px] font-medium leading-5 tracking-[0.01em] text-muted">
        The lot has fallen on
      </p>

      <p className="relative mt-3 break-words font-serif text-[28px] font-semibold leading-9 text-display">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--glow) 0%, transparent 70%)",
          }}
        />
        <span className="relative">{outcome}</span>
      </p>

      <div className="my-7 h-px w-full bg-hairline" />

      {encouraged ? (
        <p className="text-[15.5px] leading-6 text-ink">
          You’ve made a choice — well done for taking the step.
        </p>
      ) : null}

      <p
        className={cn(
          "text-[13px] leading-[18px] text-muted",
          encouraged && "mt-3",
        )}
      >
        {meta}
      </p>
    </Card>
  );
}
