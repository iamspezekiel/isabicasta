/**
 * Unbiased-where-it-matters randomness from the platform's cryptographic
 * generator. Nothing about a decision is ever sent anywhere, so this is the
 * only source of chance in the app.
 */

function randomUint32(): number {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
  ) {
    return globalThis.crypto.getRandomValues(new Uint32Array(1))[0]!;
  }
  // Fallback for environments without Web Crypto; never used in a secure
  // browser context, but keeps the app from throwing.
  return Math.floor(Math.random() * 0x1_0000_0000);
}

/** A uniform value in [0, 1). */
export function randomUnit(): number {
  return randomUint32() / 0x1_0000_0000;
}

/**
 * An index into a list of `length` items.
 *
 * The modulo introduces a negligible bias for the small lists this app draws
 * from (a coin has two faces; people cast lots over a handful of options).
 */
export function randomIndex(length: number): number {
  if (length <= 0) return 0;
  return randomUint32() % length;
}

/** Picks one item, or null when there is nothing to pick from. */
export function pickOne<T>(items: readonly T[]): T | null {
  if (items.length === 0) return null;
  return items[randomIndex(items.length)] ?? null;
}
