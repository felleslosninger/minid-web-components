import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styled } from '../mixins/tailwind.mixin';

declare global {
  interface HTMLElementTagNameMap {
    'mid-label': MinidLabel;
  }
}

@customElement('mid-label')
export class MinidLabel extends styled(LitElement) {
  /**
   * Font size
   * @default 'md'
   */
  @property()
  size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

  @property()
  for?: string;

  /**
   * Add margin below element
   * @default false
   */
  @property({ type: Boolean })
  spacing = false;

  /**
   * Font weight
   * @default 'medium'
   */
  @property()
  weight: 'medium' | 'normal' | 'semibold' = 'medium';

  override render() {
    return html`
      <label
        for=${ifDefined(this.for)}
        class="ds-label"
        data-weight=${this.weight}
        data-size=${this.size}
      >
        <slot></slot>
      </label>
    `;
  }
}
