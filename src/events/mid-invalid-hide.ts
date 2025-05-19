export type MidInvalidHideEvent = CustomEvent<{ validity: ValidityState }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'mid-invalid-hide': MidInvalidHideEvent;
  }
}
