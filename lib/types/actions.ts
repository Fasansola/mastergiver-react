/**
 * Shared discriminated union type for server action return values.
 * Usage:
 *   Promise<ActionResult>                         — { success: true } | { success: false; error: string }
 *   Promise<ActionResult<{ redirectTo: string }>> — { success: true; redirectTo: string } | { success: false; error: string }
 */
export type ActionResult<T extends Record<string, unknown> = Record<never, never>> =
  | ({ success: true } & T)
  | { success: false; error: string };
