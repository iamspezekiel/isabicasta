import { cn } from "@/lib/cn";
import { formatSlidePosition } from "@/lib/format";

export interface ProgressSegmentsProps {
  /** Zero-based index of the current slide. */
  index: number;
  total: number;
}

/**
 * Measured progress, not decoration: the count is a real position in a real
 * sequence, which is why it is allowed here.
 */
export function ProgressSegments({ index, total }: ProgressSegmentsProps) {
  return (
    <div className="mt-7">
      <p className="text-[13px] font-medium leading-[18px] tracking-[0.01em] text-muted">
        {formatSlidePosition(index)}
      </p>
      <div
        role="progressbar"
        aria-label="Onboarding progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        className="mt-3 flex items-center gap-1.5"
      >
        {Array.from({ length: total }, (_, position) => (
          <span
            key={position}
            className={cn(
              "h-1 flex-1 rounded-full",
              position < index
                ? "bg-accent"
                : position === index
                  ? "bg-primary"
                  : "bg-hairline",
            )}
          />
        ))}
      </div>
    </div>
  );
}
