import { MinidButton } from './button.component.js';

export * from './button.component.js';

declare global {
  interface HTMLElementTagNameMap {
    'mid-button': MinidButton;
  }
}
