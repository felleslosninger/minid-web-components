import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin.ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import './button.component';
import { MinidButton } from './button.component';
import { classMap } from 'lit/directives/class-map.js';

declare global {
  interface HTMLElementTagNameMap {
    'mid-menu-item': MinidMenuItem;
  }
}

@customElement('mid-menu-item')
export class MinidMenuItem extends styled(LitElement) {
  @query('.button')
  button!: MinidButton;

  /**
   * If set, the interactive element will be an anchor element
   */
  @property()
  href: string | undefined;

  /**
   * The items value
   */
  @property()
  value?: string;

  /**
   * Controls which styling to use
   */
  @property()
  variant: 'combobox' | 'dropdown' = 'dropdown';

  /**
   * Used as a focus state. So the actual focus can be somewhere else
   */
  @property({ type: Boolean, reflect: true })
  active = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'menuitem');
  }

  focus(): void {
    this.button.focus();
  }

  setActive(active: boolean) {
    this.active = active;
  }

  override render() {
    if (this.variant === 'combobox') {
      return html` <button
        class="${classMap({
          'border-transparent': !this.active,
          'bg-accent-tinted': this.active,
          'border-accent-base': this.active,
        })} button block w-full rounded border-l-[5px] px-3 py-2 font-medium"
        href=${ifDefined(this.href)}
      >
        <div class="flex items-center gap-2">
          <slot></slot>
        </div>
      </button>`;
    }

    return html`
      <mid-button
        class="button flex w-full [&::part(base)]:justify-start"
        variant="tertiary"
        href=${ifDefined(this.href)}
      >
        <slot></slot>
      </mid-button>
    `;
  }
}
