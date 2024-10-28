import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import 'components/popup.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styled } from 'mixins/tailwind.mixin.ts';
import { MinidPopup } from 'components/popup.component';

const styles = [
  css`
    :host {
      display: flex;
    }
  `,
];

/**
 * @slot -- Default slot for content of the dropdown panel
 * @slot trigger - Used for the button element that will be used to open the dropdown menu
 * @part panel - Select the dropdown panel host element
 */
@customElement('mid-dropdown')
export class MinidDropdown extends styled(LitElement, styles) {
  @property({ type: Boolean, reflect: true })
  open = false;

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  @property({ reflect: true })
  placement: MinidPopup['placement'] = 'bottom-end';

  /**
   * Sync the dropdown panel size with the trigger element
   */
  @property({ reflect: true })
  sync?: 'width' | 'height' | 'both';

  /**
   * Distance between trigger and dropdown panel
   */
  @property({ type: Number })
  distance = 4;

  /**
   * Nudge the dropdown panel position. Accepts a negative or positive number.
   */
  @property({ type: Number })
  skidding = 0;

  /**
   * Choose if position is `fixed` or `absolute`. `absolute` is more performant,
   * but `fixed` can solve issues with overflow clipping
   */
  @property({ type: Boolean })
  hoist = false;

  /**
   *
   * @ignore
   */
  #handleClickOutside = (event: Event) => {
    if (!event.composedPath().includes(this)) {
      this.#toggleDropdownOpen(event, false);
    }
  };

  #toggleDropdownOpen(event: Event, open?: boolean) {
    event.stopPropagation();

    if (open !== undefined) {
      this.open = open;
    } else {
      this.open = !this.open;
    }

    if (this.open) {
      addEventListener('click', this.#handleClickOutside);
    } else {
      removeEventListener('click', this.#handleClickOutside);
    }
  }

  override render() {
    return html`
      <mid-popup
        id="dropdown"
        distance=${this.distance}
        placement="${this.placement}"
        skidding=${this.skidding}
        strategy=${this.hoist ? 'fixed' : 'absolute'}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        sync=${ifDefined(this.sync)}
        ?active=${this.open}
        @click=${this.#toggleDropdownOpen}
      >
        <slot slot="anchor" name="trigger"> </slot>
        <div
          aria-hidden=${this.open ? 'false' : 'true'}
          aria-labelledby="dropdown"
        >
          <slot part="panel"></slot>
        </div>
      </mid-popup>
    `;
  }
}
