import { css, html, LitElement, PropertyValues } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import 'components/popup.component';
import { styled } from 'mixins/tailwind.mixin.ts';

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
@customElement('mid-combobox')
export class MinidCombobox extends styled(LitElement, styles) {
  @queryAssignedElements({ slot: 'trigger' })
  triggerElements!: HTMLInputElement[];

  @property({ type: Boolean, reflect: true })
  open = false;

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

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

  protected firstUpdated(_changedProperties: PropertyValues): void {
    const input = this.triggerElements[0];
    console.log('first updated', input);
    input?.addEventListener('input', console.log);
    input?.addEventListener('mid-focus', (e) =>
      this.#toggleDropdownOpen(e, true)
    );
  }

  /**
   *
   * @ignore
   */
  // #handleClickOutside = (event: Event) => {
  //   if (!event.composedPath().includes(this)) {
  //     this.#toggleDropdownOpen(event, false);
  //   }
  // };

  #toggleDropdownOpen(event: Event, open?: boolean) {
    event.stopPropagation();
    console.log('toggle', open);
    if (open !== undefined) {
      this.open = open;
    } else {
      this.open = !this.open;
    }

    // if (this.open) {
    //   addEventListener('click', this.#handleClickOutside);
    // } else {
    //   removeEventListener('click', this.#handleClickOutside);
    // }
  }

  override render() {
    return html`
      <mid-popup
        id="dropdown"
        distance=${this.distance}
        placement="bottom-end"
        skidding=${this.skidding}
        strategy=${this.hoist ? 'fixed' : 'absolute'}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        sync="width"
        ?active=${this.open}
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
