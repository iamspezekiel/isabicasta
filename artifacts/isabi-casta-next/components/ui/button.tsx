import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-ink hover:bg-primary-hover shadow-chip disabled:opacity-55",
  secondary:
    "border-[1.5px] border-primary text-primary bg-transparent hover:bg-primary-tint",
  ghost: "text-muted bg-transparent hover:bg-row-hover hover:text-ink",
  accent: "bg-accent text-[#1a1a1a] hover:brightness-105",
};

const SIZES: Record<Size, string> = {
  md: "h-11",
  lg: "h-12",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-btn px-4 text-[15.5px] font-semibold transition-colors disabled:cursor-not-allowed";

interface StyleProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: ReactNode;
  className?: string;
}

function buttonClasses({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className,
}: StyleProps): string {
  return cn(
    BASE,
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full",
    className,
  );
}

export interface ButtonProps
  extends Omit<ComponentProps<"button">, "className">,
    StyleProps {}

export interface ButtonLinkProps
  extends Omit<ComponentProps<typeof Link>, "className">,
    StyleProps {}

/**
 * The shared action treatment. Exactly one filled `primary` per view is the
 * rule; everything else is `secondary`, `ghost` or `accent`.
 */
export function Button({
  variant,
  size,
  fullWidth,
  icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

/** The same treatment, for an action that is actually a navigation. */
export function ButtonLink({
  variant,
  size,
  fullWidth,
  icon,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...rest}
    >
      {icon}
      {children}
    </Link>
  );
}
