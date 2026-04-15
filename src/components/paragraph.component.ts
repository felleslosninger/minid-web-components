import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin';

declare global {
  interface HTMLElementTagNameMap {
    'mid-paragraph': MinidParagraph;
  }
}

/**
 * A paragraph
 */
@customElement('mid-paragraph')
export class MinidParagraph extends styled(LitElement) {
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
      class="ds-paragraph"
      data-size=${this.size}
    >
      <slot></slot>
    </p> `;
  }
}
