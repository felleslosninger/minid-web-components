import type { MinidMenuItem } from '../components/menu-item.component';

export type MidSelectEvent = CustomEvent<{ item: MinidMenuItem }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'mid-select': MidSelectEvent;
  }
}
