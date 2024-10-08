import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { MinidElement } from 'mixins/tailwind.mixin';

@customElement('mid-menu')
export class MinidMenu extends MinidElement {
  override render() {
    return html`<ul class="fds-dropdownmenu fds-dropdownmenu--md">
      <slot></slot>
    </ul> `;
  }
}
