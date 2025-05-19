import { css, html, LitElement } from 'lit';
import { styled } from '../mixins/tailwind.mixin';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

declare global {
  interface HTMLElementTagNameMap {
    'mid-step-indicator-sm': MinidStepIndicatorSm;
  }
}

const styles = [
  css`
    :host {
      display: flex;
      justify-content: center;
    }
  `,
];

@customElement('mid-step-indicator-sm')
export class MinidStepIndicatorSm extends styled(LitElement, styles) {
  @property({ type: Number })
  steps = 0;

  @property({ type: Number })
  current = 0;

  override render() {
    return html`
      <ul class="flex space-x-2">
        ${Array.from({ length: this.steps }).map((_, index) => {
          const step = index + 1;
          return html`<li
            class="${classMap({
              'bg-accent-surface-active': step < this.current,
              'bg-accent-base': step === this.current,
              'bg-accent': step > this.current,
            })} border-accent rounded-full border p-1.5"
          ></li>`;
        })}
      </ul>
    `;
  }
}
