import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styled } from 'mixins/tailwind.mixin.ts';

@customElement('mid-menu')
export class MinidMenu extends styled(LitElement) {
  override render() {
    return html`<ul class="fds-dropdownmenu fds-dropdownmenu--md">
      <slot></slot>
    </ul> `;
  }
}
