/** e.g. formatScore(12345, "Fame") -> "12,345 Fame" */
export function formatScore(value: number, label: string): string {
  return `${value.toLocaleString()} ${label}`;
}