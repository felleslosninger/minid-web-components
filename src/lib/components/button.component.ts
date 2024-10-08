import { customElement, property } from 'lit/decorators.js';
import { MinidElement } from 'src/lib/mixins/tailwind.mixin';
import { classMap } from 'lit/directives/class-map.js';
import { literal, html } from 'lit/static-html.js';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('mid-button')
export class MinidButton extends MinidElement {
  @property()
  variant: 'primary' | 'secondary' | 'tertiary' = 'primary';

  @property()
  size: 'md' | 'lg' | 'sm' = 'md';

  @property()
  type: 'submit' | 'button' | 'reset' = 'button';

  @property()
  href = '';

  @property({ type: Boolean })
  fullWidth = false;

  @property({ type: Boolean })
  disabled = false;

  get isLink() {
    return !!this.href;
  }

  override render() {
    const tag = this.isLink ? literal`a` : literal`button`;

    return html`<${tag}
      part="base"
      class="${classMap({
        'fds-focus': true,
        'fds-btn': true,
        'fds-btn--first': true,
        'fds-btn--full-width': this.fullWidth,
        'fds-btn--primary': this.variant === 'primary',
        'fds-btn--secondary': this.variant === 'secondary',
        'fds-btn--tertiary': this.variant === 'tertiary',
        'fds-btn--sm': this.size === 'sm',
        'fds-btn--md': this.size === 'md',
        'fds-btn--lg': this.size === 'lg',
      })}"
      type=${this.type}
      ?disabled=${this.disabled}
      href="${ifDefined(this.href)}"
    >
      <slot></slot>
    </${tag}>`;
  }
}
