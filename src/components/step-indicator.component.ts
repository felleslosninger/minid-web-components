import { css, html, LitElement } from 'lit';
import { styled } from '../mixins/tailwind.mixin';
import { customElement, property } from 'lit/decorators.js';
import './icon/icon.component';
import { classMap } from 'lit/directives/class-map.js';

declare global {
  interface HTMLElementTagNameMap {
    'mid-step-indicator': MinidStepIndicator;
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

@customElement('mid-step-indicator')
export class MinidStepIndicator extends styled(LitElement, styles) {
  @property({ type: Number })
  current = 0;

  @property({ type: Array })
  steps = Array<string>();

  override render() {
    return html`
      <ol class="text-body-sm flex text-center font-medium">
        ${this.steps.map((text, index) => {
          const step = index + 1;
          return html`<li
            class="${classMap({
              'text-accent': step < this.current,
              'text-accent-base': step === this.current,
              'text-neutral-subtle': step > this.current,
            })} flex items-center"
          >
            <span
              class="${classMap({
                'text-white': step === this.current,
                'bg-accent-base': step === this.current,
              })} me-2 flex size-8 shrink-0 items-center justify-center rounded-full border"
              >${step}</span
            >
            ${text}
            <mid-icon
              class="${classMap({
                hidden: step === this.steps.length,
              })} mx-2 size-8"
              name="chevron-right"
            ></mid-icon>
          </li> `;
        })}
      </ol>
    `;
  }
}
