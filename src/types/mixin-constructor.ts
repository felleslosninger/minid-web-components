/**
 * Typing for lit element class mixins
 */

export type Constructor<T = Record<string, unknown>> = new (
  ...args: any[]
) => T;
