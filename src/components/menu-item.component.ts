import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin.ts';
import { classMap } from 'lit/directives/class-map.js';

declare global {
  interface HTMLElementTagNameMap {
    'mid-menu-item': MinidMenuItem;
  }
}

const styles = [
  css`
    /* The host is the only focusable element (see the class comment). Draw
       the ring on the base so it hugs the visible box; these are the same
       tokens the Tailwind focus-ring utility uses. */
    :host(:focus-visible) {
      outline: none;
    }

    :host(:focus-visible) [part='base'] {
      outline: 3px solid var(--ds-color-focus-outer);
      outline-offset: 3px;
      box-shadow: 0 0 0 3px var(--ds-color-focus-inner);
    }
  `,
];

@customElement('mid-menu-item')
export class MinidMenuItem extends styled(LitElement, styles) {
  /**
   * If set, activating the item navigates to this URL
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
    // Focusable for the menu's roving tab index, never a tab stop on its own.
    // mid-menu sets 0/-1 as the current item changes.
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1');
    }
    this.addEventListener('click', this.handleClick);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this.handleClick);
  }

  private handleClick = (event: MouseEvent) => {
    const href = this.href;
    if (!href) return;
    setTimeout(() => {
      if (!event.defaultPrevented) {
        window.location.assign(href);
      }
    });
  };

  setActive(active: boolean) {
    this.active = active;
  }

  override render() {
    if (this.variant === 'combobox') {
      return html`<div
        part="base"
        class="${classMap({
          'border-transparent': !this.active,
          'bg-accent-tinted': this.active,
          'border-accent-base': this.active,
        })} block w-full cursor-pointer rounded border-l-[5px] px-3 py-2 font-medium"
      >
        <div class="flex items-center gap-2">
          <slot></slot>
        </div>
      </div>`;
    }

    // Same look as a tertiary mid-button, left-aligned
    return html`
      <div
        part="base"
        class="text-accent-subtle hover:text-accent hover:bg-accent-surface-hover active:bg-accent-surface-active text-body-md leading-sm flex min-h-12 w-full cursor-pointer items-center justify-start gap-2 rounded border border-transparent bg-transparent px-4 py-2 font-medium"
      >
        <slot></slot>
      </div>
    `;
  }
}
