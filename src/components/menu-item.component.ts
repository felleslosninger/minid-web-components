import { css, html, LitElement } from 'lit';
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

const style = [
  css`
    :host[hidden] {
      display: none;
    }

    .active {
      --fds-focus-border-width: 3px;
      outline: var(--fds-focus-border-width) solid
        var(--fds-semantic-border-focus-outline);
      outline-offset: var(--fds-focus-border-width);
      box-shadow: 0 0 0 var(--fds-focus-border-width)
        var(--fds-semantic-border-focus-boxshadow);
    }

    .button {
      display: block;
    }
  `,
];
@customElement('mid-menu-item')
export class MinidMenuItem extends styled(LitElement, style) {
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
    return this.variant === 'dropdown'
      ? html`
          <mid-button
            class="flex w-full [&::part(base)]:justify-start"
            variant="tertiary"
            href=${ifDefined(this.href)}
          >
            <slot></slot>
          </mid-button>
        `
      : html` <button
          class="${classMap({
            button: true,
            'fds-label': true,
            'fds-label--md': true,
            'fds-label--medium-weight': true,
            'fds-combobox__option__label': true,
            'fds-combobox__option': true,
            'border-transparent': !this.active,
            'bg-accent-tinted': this.active,
            'border-accent-base': this.active,
          })} block w-full rounded-sm border-l-[5px] px-3 py-2"
          variant="tertiary"
          href=${ifDefined(this.href)}
        >
          <div class="col-span-2 flex items-center gap-2">
            <slot></slot>
          </div>
        </button>`;
  }
}
