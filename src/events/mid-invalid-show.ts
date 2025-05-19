export type MidInvalidShowEvent = CustomEvent<{ validity: ValidityState }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'mid-invalid-show': MidInvalidShowEvent;
  }
}
