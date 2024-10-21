import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from 'src/mixins/tailwind.mixin.js';
import './icon/icon.component';

const styles = [
  css`
    :host {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.375rem;
    }

    :host > * {
      grid-column: 2/3;
    }

    .icon {
      grid-column: 1/2;
      grid-row: 1/-1;
    }
  `,
];

@customElement('mid-alert')
export class MinidAlert extends styled(LitElement, styles) {
  @property({ type: String })
  severity: 'warning' | 'info' | 'danger' | 'success' = 'info';

  override render() {
    const danger = this.severity === 'danger';
    const warning = this.severity === 'warning';
    const info = this.severity === 'info';
    const success = this.severity === 'success';
    const iconName =
      (danger && 'xmark-octagon-fill') ||
      (warning && 'exclamationmark-triangle-fill') ||
      (success && 'checkmark-circle-fill') ||
      'information-square-fill';

    const iconColor = {
      'text-base-danger': danger,
      'text-base-warning': warning,
      'text-base-info': info,
      'text-base-success': success,
    };

    const cardColor = {
      'bg-surface-danger': danger,
      'bg-background-warning-subtle': warning,
      'bg-surface-info': info,
      'bg-surface-success': success,
      'border-border-danger': danger,
      'border-border-warning': warning,
      'border-border-info': info,
      'border-border-success': success,
    };

    return html`
      <output
        class="${classMap({
          'fds-alert': true,
          'fds-alert--md': true,
          'fds-alert--warning': warning,
          'fds-alert--success': success,
          'fds-alert--info': info,
          'fds-alert--danger': danger,
          'fds-alert--elevated': true,
        })}"
      >
        <mid-icon
          name="${iconName}"
          library="system"
          class="${classMap(iconColor)} icon p-0.5 text-2xl"
        ></mid-icon>
        <div>
          <slot></slot>
        </div>
      </output>
    `;
  }
}
