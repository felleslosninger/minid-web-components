import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MinidElement } from 'src/lib/mixins/tailwind.mixin';
import 'src/lib/components/popup.component';

@customElement('mid-dropdown')
export class MinidDropdown extends MinidElement {
  @property({ type: Boolean })
  open = false;

  static override styles = [
    MinidElement.styles,
    css`
      :host {
        display: flex;
      }
    `,
  ];

  override render() {
    return html`
      <mid-popup
        distance=${4}
        placement="bottom-end"
        flip
        shift
        ?active=${this.open}
      >
        <slot slot="anchor" name="trigger"> </slot>

        <div>
          <slot part="panel"></slot>
        </div>
      </mid-popup>
    `;
  }
}
