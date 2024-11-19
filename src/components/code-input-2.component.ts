import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styled } from 'src/mixins/tailwind.mixin';

const styles = [css``];

@customElement('mid-code-input-2')
export class MinidCodeInput2 extends styled(LitElement, styles) {
  @property({ type: Number })
  fields = 5;

  override render() {
    const fields = [];
    for (let index = 0; index <= this.fields; index++) {
      fields.push(html`<input value=${index} />`);
    }
    return html` <div class="flex">${fields}</div> `;
  }
}
