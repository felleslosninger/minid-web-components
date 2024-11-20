import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styled } from 'mixins/tailwind.mixin.ts';

const styles = [
  css`
    :host {
      --max-height: none;
    }

    ul {
      max-height: var(--max-height);
      overflow-y: auto;
    }
  `,
];

@customElement('mid-menu')
export class MinidMenu extends styled(LitElement, styles) {
  override render() {
    return html`<ul class="fds-dropdownmenu fds-dropdownmenu--md">
      <slot></slot>
    </ul> `;
  }
}
