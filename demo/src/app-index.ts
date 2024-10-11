import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@felleslosninger/minid-elements';

@customElement('app-index')
export class AppIndex extends LitElement {

  override render() {
    return html`<div>hei hei hei</div>
    <mid-countdown expiry=${Date.now() + 2 * 1000}></mid-countdown>
    <hr/>
    <mid-button  @click=${() => {console.log("You clicked?")}}>Klikk meg...</mid-button>
    <hr/>
    <mid-spinner></mid-spinner>
    `;
  }
}