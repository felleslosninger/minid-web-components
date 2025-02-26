import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styled } from '../mixins/tailwind.mixin';
import './icon/icon.component';

declare global {
  interface HTMLElementTagNameMap {
    'mid-link': MinidLink;
  }
}

const styles = [
  css`
    .fds-link {
      align-items: baseline;
    }
  `,
];

@customElement('mid-link')
export class MinidLink extends styled(LitElement, styles) {
  @property()
  href?: string;

  /**
   * White text for dark backgrounds
   */
  @property({ type: Boolean })
  inverted = false;

  @property()
  target?: string;

  override render() {
    return html`
      <a
        class="${classMap({
          'fds-link': true,
          'fds-link--inverted': this.inverted,
        })}"
        href=${ifDefined(this.href)}
        target=${ifDefined(this.target)}
      >
        <slot></slot>
      </a>
    `;
  }
}
