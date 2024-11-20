import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styled } from 'src/mixins/tailwind.mixin';

const styles = [
  css`
    :host {
      display: flex;
    }
  `,
];

@customElement('mid-phone-input')
export class MinidPhoneInput extends styled(LitElement, styles) {
  override render() {
    return html` <input class="border" placeholder="+47" />
      <input class="border" />`;
  }
}
