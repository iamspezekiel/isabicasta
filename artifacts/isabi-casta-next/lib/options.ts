/**
 * Turns the textarea contents into the list that will be drawn from.
 * One option per line; blank lines are dropped; duplicates are kept, because
 * weighing an option more heavily by listing it twice is the user's business.
 */
export function parseOptions(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
