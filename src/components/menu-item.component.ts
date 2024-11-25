import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styled } from 'mixins/tailwind.mixin.ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import './button.component';
import { live } from 'lit/directives/live';

const style = [
  css`
    .fds-dropdownmenu__item {
      display: flex;
    }

    mid-button::part(base) {
      justify-content: flex-start;
    }
  `,
];
@customElement('mid-menu-item')
export class MinidMenuItem extends styled(LitElement, style) {
  @property()
  href: string | undefined;

  @property()
  value?: string;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'menuitem');
  }

  override render() {
    return html`
      <li>
        <mid-button variant="tertiary" href=${ifDefined(this.href)} fullwidth>
          <slot></slot>
        </mid-button>
      </li>
    `;
  }
}
