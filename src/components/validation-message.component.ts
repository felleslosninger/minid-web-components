import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from '../mixins/tailwind.mixin';
import './icon/icon.component.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-validation-message': MinidValidationMessage;
  }
}

@customElement('mid-validation-message')
export class MinidValidationMessage extends styled(LitElement) {
  @property()
  color: 'danger' | 'success' | 'warning' | 'info' = 'danger';

  override render() {
    const iconMap = {
      danger: 'xmark-octagon-fill',
      success: 'checkmark-circle-fill',
      warning: 'exclamationmark-triangle-fill',
      info: 'information-square-fill',
    } as const;

    return html`
      <div
        class=${classMap({
          'mt-2 flex gap-1': true,
          'text-danger-subtle': this.color === 'danger',
          'text-success-subtle': this.color === 'success',
          'text-warning-subtle': this.color === 'warning',
          'text-info-subtle': this.color === 'info',
        })}
        aria-live=${this.color === 'danger' ? 'polite' : nothing}
      >
        <mid-icon
          name=${iconMap[this.color]}
          class="mt-1 min-h-5 min-w-5"
        ></mid-icon>
        <slot></slot>
      </div>
    `;
  }
}
