import { css, html, LitElement } from 'lit';
import { styled } from '../mixins/tailwind.mixin';
import { customElement, property } from 'lit/decorators.js';
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
  steps = 0;

  @property({ type: Number })
  current = 0;

  override render() {
    return html`
      <ul class="flex gap-8">
        ${Array.from({ length: this.steps }).map((_, index) => {
          const step = index + 1;
          const isActive = step === this.current;
          const isCompleted = step < this.current;
          const isUpcoming = step > this.current;
          return html`<li
            class="${classMap({
              'after:bg-accent-base': isActive || isCompleted,
              'border-accent-base': isActive || isCompleted,
              'after:bg-neutral-surface-active': isUpcoming,
              'border-neutral-surface-active': isUpcoming,
              'bg-neutral-surface-active': isUpcoming,
              'after:bg-transparent': step === 1,
              'bg-neutral-surface': isCompleted,
              'bg-accent-base': isActive,
              'bg-accent': isUpcoming,
            })} relative rounded-full border-4 p-1.5 after:absolute after:-left-1 after:block after:h-1 after:w-8 after:-translate-x-full after:-translate-y-1/2"
          ></li>`;
        })}
      </ul>
    `;
  }
}
