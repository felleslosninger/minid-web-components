import { customElement, property } from 'lit/decorators.js';
import { html, LitElement } from 'lit';
import { styled } from 'mixins/tailwind.mixin';
import './icon/icon.component';
import { styleMap } from 'lit/directives/style-map.js';

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
        class="animate-spin"
        library="system"
        name="circle-broken"
        style="${styleMap({
          'font-size': this.size,
        })}"
      ></mid-icon>
    `;
  }
}
