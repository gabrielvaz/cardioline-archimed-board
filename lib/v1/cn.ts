/** Concatena classes condicionais sem dependencia externa. */
export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}
