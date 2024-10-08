import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MinidElement } from 'src/lib/mixins/tailwind.mixin';

@customElement('mid-menu-item')
export class MinidMenuItem extends MinidElement {
  @property()
  href = '';

  static styles = [
    MinidElement.styles,
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
