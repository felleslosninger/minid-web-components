import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import 'components/popup.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styled } from 'mixins/tailwind.mixin.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-dropdown': MinidDropdown;
  }
}

let nextUniqueID = 0;

const styles = [
  css`
    :host {
      display: flex;
    }

    .popup {
      --arrow-size: 8px;
    }

    .popup::part(arrow) {
      z-index: 1501;
      border: 1px solid #cbcbcb;
      border-left: 0;
      border-top: 0;
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
  @state()
  popupId = `mid-dropdown-${nextUniqueID++}`;

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

  @property({ type: Boolean })
  arrow = false;

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
      addEventListener(
        'mid-anchor-click',
        this.handleAnchorClick as EventListener
      );
    } else {
      this.blur();
      removeEventListener(
        'mid-anchor-click',
        this.handleAnchorClick as EventListener
      );
      removeEventListener('click', this.#handleClickOutside);
    }
  }

  handleAnchorClick = (event: CustomEvent<{ id: string }>) => {
    // to make sure clicking another element's anchor closes current element's dropdown menu
    if (event.detail.id !== this.popupId) {
      this.#toggleDropdownOpen(event, false);
    }
  };

  override render() {
    return html`
      <mid-popup
        id="${this.popupId}"
        class="popup"
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
        ?arrow=${this.arrow}
        @click=${this.#toggleDropdownOpen}
      >
        <slot slot="anchor" name="trigger"> </slot>
        <div
          aria-hidden=${this.open ? 'false' : 'true'}
          aria-labelledby="${this.popupId}"
        >
          <slot part="panel"></slot>
        </div>
      </mid-popup>
    `;
  }
}
