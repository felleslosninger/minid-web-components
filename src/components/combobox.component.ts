import { css, html, LitElement, PropertyValues } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import 'components/popup.component';
import { ifDefined } from 'lit/directives/if-defined.js';
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

  @property({ reflect: true })
  placement:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end' = 'bottom-end';

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

  protected firstUpdated(_changedProperties: PropertyValues): void {
    const input = this.triggerElements[0];
    input?.addEventListener('input', console.log);
    input?.addEventListener('focus', (e) => this.#toggleDropdownOpen(e, true));
  }

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
