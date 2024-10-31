import { customElement } from 'lit/decorators.js';
import { html, LitElement } from 'lit';
import { styled } from 'mixins/tailwind.mixin';
import './icon/icon.component';

/**
 * Size and color can be adjusted with `font-size` and `color` css properties
 */
@customElement('mid-spinner')
export class MinidSpinner extends styled(LitElement) {
  override render() {
    return html`
      <mid-icon
        class="animate-spin"
        library="system"
        name="circle-broken"
      ></mid-icon>
    `;
  }
}
