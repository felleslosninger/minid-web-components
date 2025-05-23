import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin';
import './icon/icon.component.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-validation-message': MinidValidationMessage;
  }
}

@customElement('mid-validation-message')
export class MinidValidationMessage extends styled(LitElement) {
  override render() {
    return html`
      <div class="text-danger-subtle mt-2 flex gap-1" aria-live="polite">
        <mid-icon
          name="xmark-octagon-fill"
          class="mt-1 min-h-5 min-w-5"
        ></mid-icon>
        <slot> </slot>
      </div>
    `;
  }
}
