import { ButtonLink } from "@/components/ui/button";

/**
 * An empty record is a dead end unless it offers the two things this app can
 * actually do, so it does.
 */
export function EmptyHistory() {
  return (
    <div className="mt-8">
      <p className="text-[15.5px] leading-6 text-muted">
        No activity yet. Flip a coin or cast lots to get started.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <ButtonLink href="/coin" variant="secondary" size="md">
          Flip coin
        </ButtonLink>
        <ButtonLink href="/lots" variant="secondary" size="md">
          Cast lots
        </ButtonLink>
      </div>
    </div>
  );
}
