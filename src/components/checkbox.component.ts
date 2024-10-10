import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { tailwind } from 'src/mixins/tailwind.mixin';

@customElement('mid-checkbox')
export class MinidCheckbox extends tailwind(LitElement) {
  override render() {
    return html` <slot></slot> `;
  }
}
