import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin.js';
import 'components/icon/icon.component.js';
import 'components/button.component.js';
import 'components/popup.component.js';
import { waitForEvent } from 'src/internal/event.js';

const styles = [
  css`
    .icon {
      font-size: 100px;
    }
  `,
];

@customElement('mid-helptext')
export class MinidHelptext extends styled(LitElement, styles) {
  /**
   * Indicates whether or not the tooltip is open. You can use this in lieu of the show/hide methods.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Shows the tooltip.
   */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, 'mid-after-show');
  }

  /**
   * Hides the tooltip
   */
  async hide() {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    return waitForEvent(this, 'mid-after-hide');
  }

  override render() {
    return html`
      <mid-popup ?active=${true}>
        <!-- class="fds-helptext--md fds-helptext__button fds-focus" -->
        <mid-button slot="anchor" variant="tertiary" iconstyled>
          <mid-icon library="system" name="questionmark-circle"></mid-icon>
        </mid-button>
        <div>${'hei hei'}</div>
      </mid-popup>
    `;
  }
}
