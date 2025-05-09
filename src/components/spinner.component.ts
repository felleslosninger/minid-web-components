import { customElement } from 'lit/decorators.js';
import { css, html, LitElement } from 'lit';
import { styled } from '../mixins/tailwind.mixin';

declare global {
  interface HTMLElementTagNameMap {
    'mid-spinner': MinidSpinner;
  }
}

const styles = [
  css`
    :host {
      display: inline-flex;
    }
  `,
];

/**
 * Size and color can be adjusted with `font-size` and `color` css properties
 */
@customElement('mid-spinner')
export class MinidSpinner extends styled(LitElement, styles) {
  override render() {
    return html`
      <svg
        class="animate-spin-slow"
        width="1em"
        height="1em"
        viewBox="0 0 50 50"
      >
        <circle
          opacity="0.2"
          stroke="currentColor"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
        ></circle>
        <circle
          class="animate-dash"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
          stroke="currentColor"
        ></circle>
      </svg>
    `;
  }
}
