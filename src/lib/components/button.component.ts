import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { MinidElement } from 'src/lib/mixins/tailwind.mixin';
import { classMap } from 'lit/directives/class-map.js';

let nextInputId = 0;

@customElement('mid-button')
export class MinidButton extends MinidElement {
  @property()
  variant: 'primary' | 'secondary' | 'tertiary' = 'primary';

  @property()
  size: 'md' | 'lg' | 'sm' = 'md';

  @property()
  type: 'submit' | 'button' | 'reset' = 'button';

  @property()
  id = `'mid-button-${nextInputId++}`;

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
