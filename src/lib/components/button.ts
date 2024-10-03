import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import style from '@digdir/designsystemet-css?inline';
import theme from '@digdir/designsystemet-theme?inline';
import { TailwindLitElement } from 'src/lib/mixins/tailwind.mixin';
import { classMap } from 'lit/directives/class-map.js';

@customElement('mwc-button')
export class Button extends TailwindLitElement {
  static override styles = [unsafeCSS(theme), unsafeCSS(style)];

  @property()
  variant: 'primary' | 'secondary' | 'tertiary' = 'primary';

  @property()
  size: 'md' | 'lg' | 'sm' = 'md';

  @property()
  type: 'submit' | 'button' | 'reset' = 'button';

  override render() {
    const classes = {
      'fds-btn--primary': this.variant === 'primary',
      'fds-btn--secondary': this.variant === 'secondary',
      'fds-btn--tertiary': this.variant === 'tertiary',
      'fds-btn--sm': this.size === 'sm',
      'fds-btn--md': this.size === 'md',
      'fds-btn--lg': this.size === 'lg',
    };
    return html`<button
      class="${classMap(classes)} fds-focus fds-btn fds-btn--first"
      type=${this.type}
    >
      <slot></slot>
    </button>`;
  }
}
