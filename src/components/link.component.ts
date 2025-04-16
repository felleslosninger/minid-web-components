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
        class="text-accent-subtle visited:text-link-visited focus-visible:bg-focus-outer inline-flex items-center gap-2 underline decoration-[.0625rem] underline-offset-[.27em] outline-0 focus-visible:text-white"
        href=${ifDefined(this.href)}
        target=${ifDefined(this.target)}
      >
        <slot></slot>
      </a>
    `;
  }
}
