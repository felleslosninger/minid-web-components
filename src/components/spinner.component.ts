import { customElement, property } from 'lit/decorators.js';
import { css, html, LitElement } from 'lit';
import { styled } from '../mixins/tailwind.mixin';
import dsStyles from '@digdir/designsystemet-css/spinner.css?inline';
import { ifDefined } from 'lit/directives/if-defined.js';

declare global {
  interface HTMLElementTagNameMap {
    'mid-spinner': MinidSpinner;
  }
}

const styles = [
  dsStyles,
  css`
    :host {
      display: inline-flex;
    }
  `,
];

/**
 *
 */
@customElement('mid-spinner')
export class MinidSpinner extends styled(LitElement, styles) {
  @property({ attribute: 'data-size' })
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  @property({ attribute: 'data-color' })
  color?:
    | 'neutral'
    | 'accent'
    | 'brand1'
    | 'brand2'
    | 'brand3'
    | 'info'
    | 'warning'
    | 'danger';

  override render() {
    return html`
      <svg
        class="ds-spinner"
        width="1em"
        height="1em"
        viewBox="0 0 50 50"
        role="img"
        data-size="${ifDefined(this.size)}"
      >
        <circle
          class="ds-spinner__background"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
        ></circle>
        <circle
          class="ds-spinner__circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
          stroke="currentColor"
          stroke-linecap="round"
        ></circle>
      </svg>
    `;
  }
}
