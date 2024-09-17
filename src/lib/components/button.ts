import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from '@digdir/designsystemet-css?inline';
import theme from '@digdir/designsystemet-theme?inline';

@customElement('mwc-button')
export class Button extends LitElement {
  static styles = [unsafeCSS(style), unsafeCSS(theme)];
  override render() {
    return html`<button
      class="fds-btn fds-btn--first fds-btn--md fds-btn--secondary fds-focus"
    >
      <slot></slot>
    </button>`;
  }
}
