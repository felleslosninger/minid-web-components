import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '@digdir/designsystemet-css?inline';
import theme from '@digdir/designsystemet-theme?inline';
import { unsafeCSS } from 'lit';

@customElement('mid-menu-item')
export class MinidMenuItem extends LitElement {
  @property()
  href = '';

  static styles = [
    unsafeCSS(styles),
    unsafeCSS(theme),
    css`
      .fds-dropdownmenu__item {
        display: flex;
      }
      ::part(base) {
        justify-content: flex-start;
      }
    `,
  ];

  override render() {
    return html`
      <li>
        <mid-button variant="tertiary" href=${this.href} fullWidth>
          <slot></slot>
        </mid-button>
      </li>
    `;
  }
}
