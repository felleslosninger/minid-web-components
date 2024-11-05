import { customElement } from 'lit/decorators.js';
import { css, html, LitElement } from 'lit';
import { styled } from 'mixins/tailwind.mixin';
import './icon/icon.component';

const styles = [
  css`
    :host {
      display: inline-flex;
    }
  `,
];

/**
 * Size and color can be adjusted with `font-size` and `color` css properties
 */
@customElement('mid-spinner')
export class MinidSpinner extends styled(LitElement, styles) {
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
