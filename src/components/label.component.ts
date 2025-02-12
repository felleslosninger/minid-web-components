import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styled } from 'src/mixins/tailwind.mixin';

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
        class=${classMap({
          'fds-label': true,
          'fds-label--spacing': this.spacing,
          'fds-label--xs': this.size === 'xs',
          'fds-label--sm': this.size === 'sm',
          'fds-label--md': this.size === 'md',
          'fds-label--lg': this.size === 'lg',
          'fds-label--medium-weight': this.weight === 'medium',
          'fds-label--regular-weight': this.weight === 'normal',
          'fds-label--semibold-weight': this.weight === 'semibold',
        })}
      >
        <slot></slot>
      </label>
    `;
  }
}
