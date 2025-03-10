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

  override render() {
    return html`
      <a
        class="ds-link"
        href=${ifDefined(this.href)}
        target=${ifDefined(this.target)}
        data-size=${ifDefined(this.size)}
      >
        <slot></slot>
      </a>
    `;
  }
}
