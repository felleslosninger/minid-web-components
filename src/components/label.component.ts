import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styled } from '../mixins/tailwind.mixin';
import dsStyles from '@digdir/designsystemet-css/label.css?inline';

declare global {
  interface HTMLElementTagNameMap {
    'mid-label': MinidLabel;
  }
}

const styles = [dsStyles];

@customElement('mid-label')
export class MinidLabel extends styled(LitElement, styles) {
  /**
   * Font size
   * @default 'md'
   */
  @property()
  size?: 'sm' | 'md' | 'lg';

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

  /**
   * Margin bottom.
   * Corresponds to `--ds-size-*`
   */
  @property({ type: Number })
  mb: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

  override render() {
    return html`
      <label
        class="ds-label"
        style="margin-bottom: var(--ds-size-${this.mb})"
        for=${ifDefined(this.for)}
        data-size=${ifDefined(this.size)}
        data-weight=${this.weight}
      >
        <slot></slot>
      </label>
    `;
  }
}
