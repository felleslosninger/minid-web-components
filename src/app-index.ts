import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@digdir/designsystemet-css?inline';
import './src/components/button.component';

@customElement('app-index')
export class AppIndex extends LitElement {
  static styles = css`
    :host {
      display: grid;
      padding: 20px;
      gap: 20px;
    }
  `;
  override render() {
    return html`<div>hei hei hei</div>
      <mwc-button>Knapp</mwc-button>`;
  }
}
