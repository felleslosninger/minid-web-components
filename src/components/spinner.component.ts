import { customElement, property } from 'lit/decorators.js';
import { html, LitElement } from 'lit';
import { styled } from 'mixins/tailwind.mixin';
import './icon/icon.component';

@customElement('mid-spinner')
export class MinidSpinner extends styled(LitElement) {
  /**
   * Accepts a css property like `100px` or `40rem` or number of pixels like `68`
   * @default '150px'
   */
  @property({ type: String })
  size = '150px';

  override render() {
    return html`
      <mid-icon
        size=${this.size}
        library="system"
        name="circle-broken"
        class="animate-spin"
      ></mid-icon>
    `;
  }
}
