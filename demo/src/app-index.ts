import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@felleslosninger/minid-elements';

@customElement('app-index')
export class AppIndex extends LitElement {
  static styles = [
    css`
      .icon {
        font-size: 3.5rem;
      }
    `,
  ];
  override render() {
    return html`<div>hei hei hei</div>
      <mid-countdown expiry=${Date.now() + 60 * 1000}></mid-countdown>
      <hr />
      <mid-button
        @click=${() => {
          console.log('You clicked?');
        }}
        >Klikk meg...</mid-button
      >
      <hr />
      <mid-spinner class="icon"></mid-spinner>
      <mid-spinner class="icon"></mid-spinner>
      <mid-icon class="icon" name="bell"></mid-icon>
      <mid-icon class="icon" name="bell"></mid-icon> `;
  }
}
