/** Joins truthy class names. Small enough that a class-name library would be overkill. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}