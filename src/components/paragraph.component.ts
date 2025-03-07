import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin';
import dsStyles from '@digdir/designsystemet-css/paragraph.css?inline';

declare global {
  interface HTMLElementTagNameMap {
    'mid-paragraph': MinidParagraph;
  }
}

const styles = [
  dsStyles,
  css`
    :host {
      display: block;
    }
  `,
];

/**
 * A paragraph
 */
@customElement('mid-paragraph')
export class MinidParagraph extends styled(LitElement, styles) {
  /**
   *
   */
  @property()
  size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

  /**
   * Add margin below element
   */
  @property({ type: Boolean })
  spacing = false;

  @property()
  variant: 'short' | 'long' | 'default' = 'default';

  /**
   * Margin bottom.
   * Corresponds to `--ds-size-*`
   */
  @property({ type: Number })
  mb: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

  override render() {
    return html`<p
      class="ds-paragraph"
      style="margin-bottom: var(--ds-size-${this.mb})"
      data-variant=${this.variant}
      data-size=${this.size}
      ?spacing=${this.spacing}
    >
      <slot></slot>
    </p> `;
  }
}
