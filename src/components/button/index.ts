import { MinidButton } from './button.component.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-button': MinidButton;
  }
}
export { MinidButton };
