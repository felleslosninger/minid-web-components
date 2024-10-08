import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MinidElement } from 'mixins/tailwind.mixin';
import 'components/popup.component';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('mid-dropdown')
export class MinidDropdown extends MinidElement {
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

  @property({ reflect: true })
  sync?: 'width' | 'height' | 'both';

  @property({ type: Number })
  distance = 4;

  @property({ type: Number })
  skidding = 0;

  @property({ type: Boolean })
  hoist = false;

  handleClickOutside = (event: Event) => {
    if (!event.composedPath().includes(this)) {
      this.toggleDropdownOpen(event, false);
    }
  };

  toggleDropdownOpen(event: Event, open?: boolean) {
    event.stopPropagation();

    if (open !== undefined) {
      this.open = open;
    } else {
      this.open = !this.open;
    }

    if (this.open) {
      addEventListener('click', this.handleClickOutside);
    } else {
      removeEventListener('click', this.handleClickOutside);
    }
  }

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
        @click=${this.toggleDropdownOpen}
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
