import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from 'src/mixins/tailwind.mixin.ts';
import './icon/icon.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { watch } from 'src/internal/watch';
import {
  getAnimation,
  setDefaultAnimation,
} from 'src/components/utilities/animation-registry';
import { waitForEvent } from 'src/internal/event';
import { animateTo, stopAnimations } from 'src/internal/animate';
import { MidIconName } from 'src/types/icon-name';

const toastStack = Object.assign(document.createElement('div'), {
  className: 'mid-toast-stack',
});

const styles = [
  css`
    [hidden] {
      display: none !important;
    }

    .fds-alert__icon {
      font-size: var(--fds-alert-icon-size);
    }

    .close-button {
      font-size: 24px;
      display: inline-flex;
      align-self: center;
      padding: 10px;
      border-radius: 4px;
      margin-top: -10px;
      margin-bottom: -10px;

      color: var(--fds-alert-icon-color);
    }

    .close-button:hover {
      background-color: color-mix(
        in srgb,
        var(--fds-alert-icon-color) 20%,
        var(--fds-alert-background)
      );
    }

    .message-details {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      padding: 0.75rem;

      background-color: color-mix(
        in srgb,
        var(--fds-alert-icon-color) 20%,
        var(--fds-alert-background)
      );

      border-left: solid 4px
        color-mix(
          in srgb,
          var(--fds-alert-border-color),
          var(--fds-alert-background)
        );
    }
  `,
];

/**
 * Alerts need to have the `open` attribute to be displayed
 * @csspart base - Select the base of the alert
 *
 * @event mid-show - Emitted when the alert opens.
 * @event mid-after-show - Emitted after the alert opens and all animations are complete.
 * @event mid-hide - Emitted when the alert closes.
 * @event mid-after-hide - Emitted after the alert closes and all animations are complete.
 *
 * @slot -- The default slot for the content of the alert
 *
 * @animation alert.show - The animation to use when showing the alert.
 * @animation alert.hide - The animation to use when hiding the alert.
 */
@customElement('mid-alert')
export class MinidAlert extends styled(LitElement, styles) {
  private autoHideTimeout?: number;
  private remainingTimeInterval?: number;

  @query('[part~="base"]')
  base!: HTMLElement;

  /**
   * Indicates whether or not the alert is open. You can toggle this attribute to show and hide the alert, or you can
   * use the `show()` and `hide()` methods and this attribute will reflect the alert's open state.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Enables a close button that allows the user to dismiss the alert.
   */
  @property({ type: Boolean, reflect: true })
  closable = false;

  /**
   * The length of time, in milliseconds, the alert will show before closing itself. If the user interacts with
   * the alert before it closes (e.g. moves the mouse over it), the timer will restart. Defaults to `Infinity`, meaning
   * the alert will not close on its own.
   */
  @property({ type: Number })
  duration = Infinity;

  /**
   * Sets color and icon according to severity
   */
  @property({ reflect: true })
  severity: 'warning' | 'info' | 'danger' | 'success' = 'info';

  /**
   * Sets size of icon, padding and font-size.
   */
  @property({ reflect: true })
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

  @state()
  private remainingTime = this.duration;

  @state()
  notificationContent?: {
    title?: string;
    message: string;
    details?: string;
  };

  firstUpdated() {
    this.base.hidden = !this.open;
  }

  private restartAutoHide() {
    clearTimeout(this.autoHideTimeout);
    clearInterval(this.remainingTimeInterval);
    if (this.open && this.duration < Infinity) {
      this.autoHideTimeout = window.setTimeout(
        () => this.hide(),
        this.duration
      );
      this.remainingTime = this.duration;
      this.remainingTimeInterval = window.setInterval(() => {
        this.remainingTime -= 100;
      }, 100);
    }
  }

  private pauseAutoHide() {
    clearTimeout(this.autoHideTimeout);
    clearInterval(this.remainingTimeInterval);
  }

  private resumeAutoHide() {
    if (this.duration < Infinity) {
      this.autoHideTimeout = window.setTimeout(
        () => this.hide(),
        this.remainingTime
      );
      this.remainingTimeInterval = window.setInterval(() => {
        this.remainingTime -= 100;
      }, 100);
    }
  }

  @watch('open', { waitUntilFirstUpdate: true })
  async handleOpenChange() {
    if (this.open) {
      // Show
      this.dispatchEvent(
        new Event('mid-show', { composed: true, bubbles: true })
      );

      if (this.duration < Infinity) {
        this.restartAutoHide();
      }

      await stopAnimations(this.base);
      this.base.hidden = false;
      const { keyframes, options } = getAnimation(this, 'alert.show');
      await animateTo(this.base, keyframes, options);

      this.dispatchEvent(
        new Event('mid-after-show', { composed: true, bubbles: true })
      );
    } else {
      // Hide
      this.dispatchEvent(
        new Event('mid-hide', { composed: true, bubbles: true })
      );

      clearTimeout(this.autoHideTimeout);
      clearInterval(this.remainingTimeInterval);

      await stopAnimations(this.base);
      const { keyframes, options } = getAnimation(this, 'alert.hide');
      await animateTo(this.base, keyframes, options);
      this.base.hidden = true;

      this.dispatchEvent(
        new Event('mid-after-hide', { composed: true, bubbles: true })
      );
    }
  }

  @watch('duration')
  handleDurationChange() {
    this.restartAutoHide();
  }

  /**
   * Shows the alert.
   */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, 'mid-after-show');
  }

  /**
   * Hides the alert
   */
  async hide() {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    return waitForEvent(this, 'mid-after-hide');
  }

  /**
   * Displays the alert as a toast notification. This will move the alert out of its position in the DOM and, when
   * dismissed, it will be removed from the DOM completely. By storing a reference to the alert, you can reuse it by
   * calling this method again. The returned promise will resolve after the alert is hidden.
   */
  async toast(
    content: MinidAlert['notificationContent'],
    closable = true,
    severity?: MinidAlert['severity'],
    duration?: number
  ) {
    return new Promise<void>((resolve) => {
      if (toastStack.parentElement === null) {
        document.body.append(toastStack);
      }

      if (content) {
        this.notificationContent = content;
      }

      if (severity) {
        this.severity = severity;
      }

      if (duration) {
        this.duration = duration;
      }

      this.closable = closable;
      this.elevated = true;

      // We wrap this in a timeout for `getBoundingClientRect` to get the height properly
      setTimeout(() => {
        toastStack.appendChild(this);

        animateTo(
          toastStack,
          [
            {
              transform: `translateY(${this.getBoundingClientRect().height}px)`,
            },
            { transform: 'translateY(0px)' },
          ],
          { duration: 250, easing: 'ease-out' }
        );
      }, 0);

      // Wait for the toast stack to render
      requestAnimationFrame(() => {
        // Force a reflow for the initial transition
        this.clientWidth;
        this.show();
      });

      this.addEventListener(
        'mid-after-hide',
        () => {
          toastStack.removeChild(this);
          resolve();

          // Remove the toast stack from the DOM when there are no more alerts
          if (toastStack.querySelector('mid-alert') === null) {
            toastStack.remove();
          }
        },
        { once: true }
      );
    });
  }

  override render() {
    const danger = this.severity === 'danger';
    const warning = this.severity === 'warning';
    const info = this.severity === 'info';
    const success = this.severity === 'success';
    const iconName: MidIconName =
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
        part="base"
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
        @mouseenter=${this.pauseAutoHide}
        @mouseleave=${this.resumeAutoHide}
      >
        <mid-icon
          class="fds-alert__icon"
          name="${iconName}"
          library="system"
          alt=${ifDefined(this.iconlabel)}
        ></mid-icon>
        <div
          aria-live="polite"
          class=${classMap({
            'fds-paragraph': true,
            'fds-paragraph--sm': this.size === 'sm',
            'fds-paragraph--md': this.size === 'md',
            'fds-paragraph--lg': this.size === 'lg',
          })}
        >
          <slot>
            ${!this.notificationContent?.title
              ? nothing
              : html`<h2 class="mb-2 text-xl font-semibold">
                  ${this.notificationContent?.title}
                </h2>`}
            ${this.notificationContent?.message}
            ${!this.notificationContent?.details
              ? nothing
              : html`<div class="message-details">
                  <pre>${this.notificationContent?.details}</pre>
                </div>`}
          </slot>
        </div>
        ${this.closable
          ? html`
              <button class="close-button" @click="${this.hide}">
                <mid-icon name="xmark"> </mid-icon>
              </button>
            `
          : nothing}
      </div>
    `;
  }
}

setDefaultAnimation('alert.show', {
  keyframes: [
    { opacity: 0, transform: 'translateY(100%)' },
    { opacity: 1, transform: 'translateY(0px)' },
  ],
  options: { duration: 400, easing: 'ease-out' },
});

setDefaultAnimation('alert.hide', {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 },
  ],
  options: { duration: 250, easing: 'ease-in' },
});
