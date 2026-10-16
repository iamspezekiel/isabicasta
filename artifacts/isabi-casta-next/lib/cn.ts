/** Tiny class-name joiner, so the app needs no runtime dependency for it. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
