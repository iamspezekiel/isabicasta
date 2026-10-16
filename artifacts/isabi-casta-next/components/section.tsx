import type { ReactNode } from "react";

export interface SectionProps {
  icon: ReactNode;
  heading: string;
  children: ReactNode;
}

/**
 * An explainer section. Unboxed on purpose: the screen has four of these and
 * carding all four would turn an explanation into a dashboard.
 */
export function Section({ icon, heading, children }: SectionProps) {
  return (
    <section className="pt-8">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[20px] leading-none text-muted"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-[17px] font-semibold leading-6">{heading}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-[15.5px] leading-[26px] text-muted">{children}</p>
  );
}

export function Divider() {
  return <div className="mt-9 h-px bg-hairline" />;
}
