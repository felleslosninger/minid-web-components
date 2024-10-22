import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from 'src/mixins/tailwind.mixin.js';
import './icon/icon.component';
import { ifDefined } from 'lit/directives/if-defined.js';

const styles = [
  css`
    .fds-alert__icon {
      font-size: var(--fds-alert-icon-size);
    }
  `,
];

@customElement('mid-alert')
export class MinidAlert extends styled(LitElement, styles) {
  /**
   * Sets color and icon according to severity
   */
  @property({ type: String })
  severity: 'warning' | 'info' | 'danger' | 'success' = 'info';

  /**
   * Sets size of icon, padding and font-size.
   */
  @property({ type: String })
  size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Adds a shadow to elevate the component
   */
  @property({ type: Boolean })
  elevated = false;

  /**
   * Sets the `aria-label` on the icon
   * Use this to inform screenreaders of severity. Defaults to Norwegian.
   */
  @property({ type: String })
  iconlabel?: string;

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
    this.iconlabel ??=
      (danger && 'Feil') ||
      (warning && 'Advarsel') ||
      (success && 'Suksess') ||
      'Informasjon';

    return html`
      <div
        class="${classMap({
          'fds-alert': true,
          'fds-alert--sm': this.size === 'sm',
          'fds-alert--md': this.size === 'md',
          'fds-alert--lg': this.size === 'lg',
          'fds-alert--warning': warning,
          'fds-alert--success': success,
          'fds-alert--info': info,
          'fds-alert--danger': danger,
          'fds-alert--elevated': this.elevated,
        })}"
      >
        <mid-icon
          class="fds-alert__icon"
          name="${iconName}"
          library="system"
          alt=${ifDefined(this.iconlabel)}
        ></mid-icon>
        <div
          class=${classMap({
            'fds-paragraph': true,
            'fds-paragraph--sm': this.size === 'sm',
            'fds-paragraph--md': this.size === 'md',
            'fds-paragraph--lg': this.size === 'lg',
          })}
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}
