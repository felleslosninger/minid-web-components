import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styled } from 'mixins/tailwind.mixin.ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import './button.component';
import { MinidButton } from './button.component';
import { classMap } from 'lit/directives/class-map.js';

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

    .fds-dropdownmenu__item {
      display: flex;
    }

    mid-button::part(base) {
      justify-content: flex-start;
    }
  `,
];
@customElement('mid-menu-item')
export class MinidMenuItem extends styled(LitElement, style) {
  @query('.button')
  button!: MinidButton;

  @property()
  href: string | undefined;

  @property()
  value?: string;

  @property()
  variant: 'combobox' | 'dropdown' = 'dropdown';

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
    console.log(this.variant);

    return this.variant === 'dropdown'
      ? html`
          <mid-button variant="tertiary" href=${ifDefined(this.href)} fullwidth>
            <slot></slot>
          </mid-button>
        `
      : html` <button
          class=${classMap({
            button: true,
            'fds-combobox__option': true,
            'fds-combobox__option--active': this.active,
          })}
          variant="tertiary"
          href=${ifDefined(this.href)}
          fullwidth
        >
          <div class="col-span-2 flex items-center gap-2">
            <slot></slot>
          </div>
        </button>`;
  }
}

export function getMenuItemScrollPosition(
  optionOffset: number,
  optionHeight: number,
  currentScrollPosition: number,
  panelHeight: number
): number {
  const halfHeight = panelHeight / 2;

  if (optionOffset - halfHeight < currentScrollPosition) {
    return optionOffset - halfHeight;
  }

  if (
    optionOffset + optionHeight - halfHeight >
    currentScrollPosition + panelHeight
  ) {
    return (
      Math.max(0, optionOffset - panelHeight + optionHeight) - halfHeight + 10
    );
  }

  return currentScrollPosition;
}
