import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styled } from '../mixins/tailwind.mixin';
import dsStyles from '@digdir/designsystemet-css/link.css?inline';

declare global {
  interface HTMLElementTagNameMap {
    'mid-link': MinidLink;
  }
}

const styles = [dsStyles];

@customElement('mid-link')
export class MinidLink extends styled(LitElement, styles) {
  @property()
  href?: string;

  @property()
  size?: 'sm' | 'md' | 'lg';

  @property()
  target?: string;

  /**
   * Margin bottom.
   * Corresponds to `--ds-size-*`
   */
  @property({ type: Number })
  mb: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

  override render() {
    return html`
      <a
        class="ds-link"
        style="margin-bottom: var(--ds-size-${this.mb})"
        href=${ifDefined(this.href)}
        target=${ifDefined(this.target)}
        data-size=${ifDefined(this.size)}
      >
        <slot></slot>
      </a>
    `;
  }
}
