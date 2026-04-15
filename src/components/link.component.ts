import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styled } from '../mixins/tailwind.mixin';

declare global {
  interface HTMLElementTagNameMap {
    'mid-link': MinidLink;
  }
}

@customElement('mid-link')
export class MinidLink extends styled(LitElement) {
  @property()
  href?: string;

  @property()
  target?: string;

  override render() {
    return html`
      <a
        class="ds-link"
        href=${ifDefined(this.href)}
        target=${ifDefined(this.target)}
      >
        <slot></slot>
      </a>
    `;
  }
}
