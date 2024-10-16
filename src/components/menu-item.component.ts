import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styled } from 'mixins/tailwind.mixin.ts';
import { ifDefined } from 'lit/directives/if-defined.js';

const style = [
  css`
    .fds-dropdownmenu__item {
      display: flex;
    }

    ::part(base) {
      justify-content: flex-start;
    }
  `,
];
@customElement('mid-menu-item')
export class MinidMenuItem extends styled(LitElement, style) {
  @property()
  href: string | undefined;

  override render() {
    return html`
      <li>
        <mid-button variant="tertiary" href=${ifDefined(this.href)} full-width>
          <slot></slot>
        </mid-button>
      </li>
    `;
  }
}
