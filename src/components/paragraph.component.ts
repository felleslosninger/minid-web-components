import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { tailwind } from 'src/mixins/tailwind.mixin';

/**
 * A paragraph
 */
@customElement('mid-paragraph')
export class MinidParagraph extends tailwind(LitElement) {
  /**
   * `'md' = 18px`
   * `'sm' = 16px`
   * `'lg' = 21px`
   * @default 'md'
   */
  @property()
  size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

  @property({ type: Boolean })
  spacing = true;

  override render() {
    return html`<p
      class="${classMap({
        'fd-paragraph': true,
        'fds-paragraph--spacing': this.spacing,
        'fds-paragraph--xs': this.size === 'xs',
        'fds-paragraph--sm': this.size === 'sm',
        'fds-paragraph--md': this.size === 'md',
        'fds-paragraph--lg': this.size === 'lg',
      })}"
    >
      <slot></slot>
    </p> `;
  }
}
