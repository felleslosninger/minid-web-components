import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from '@digdir/designsystemet-css?inline';
import theme from '@digdir/designsystemet-theme?inline';
import { unsafeCSS } from 'lit';

@customElement('mid-menu')
export class MinidMenu extends LitElement {
  static override styles = [unsafeCSS(styles), unsafeCSS(theme)];
  override render() {
    return html`<ul class="fds-dropdownmenu fds-dropdownmenu--md">
      <slot></slot>
    </ul> `;
  }
}
