import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@felleslosninger/minid-elements/index.js';

@customElement('app-index')
export class AppIndex extends LitElement {

  override render() {
    return html`<div>hei hei hei</div>
      <mid-button>Press me harder...</mid-button>`;
  }
}
