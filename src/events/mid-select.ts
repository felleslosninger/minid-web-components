import type { MinidMenuItem } from 'src/components/menu-item.component';

export type MidSelectEvent = CustomEvent<{ item: MinidMenuItem }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'mid-select': MidSelectEvent;
  }
}
