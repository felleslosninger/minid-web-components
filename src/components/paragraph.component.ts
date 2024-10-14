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
   * `'xs' = 14px`
   * `'sm' = 16px`
   * `'md' = 18px`
   * `'lg' = 21px`
   * @default 'md'
   */
  @property()
  size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

  /**
   * Add margin below element
   * @default false
   */
  @property({ type: Boolean })
  spacing = false;

  override render() {
    return html`<p
      class="${classMap({
        'fds-paragraph': true,
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
