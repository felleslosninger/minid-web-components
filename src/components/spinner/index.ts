import { MinidSpinner } from './spinner.component.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-spinner': MinidSpinner;
  }
}

export { MinidSpinner };
