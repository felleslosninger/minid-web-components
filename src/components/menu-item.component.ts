import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styled } from 'mixins/tailwind.mixin.ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import './button.component';
import { MinidButton } from './button.component';

const style = [
  css`
    :host[hidden] {
      display: none;
    }

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
  @query('.button')
  button!: MinidButton;

  @property()
  href: string | undefined;

  @property()
  value?: string;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'menuitem');
  }

  focus(): void {
    this.button.focus();
  }

  override render() {
    return html`
      <li>
        <mid-button
          class="button"
          variant="tertiary"
          href=${ifDefined(this.href)}
          fullwidth
        >
          <slot></slot>
        </mid-button>
      </li>
    `;
  }
}
