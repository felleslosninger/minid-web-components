import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from '../mixins/tailwind.mixin.ts';
import './icon/icon.component';
import { watch } from '../internal/watch';
import {
  getAnimation,
  setDefaultAnimation,
} from '../utilities/animation-registry';
import { waitForEvent } from '../internal/event';
import { animateTo, stopAnimations } from '../internal/animate';
import './button.component';
import './heading.component';
import './paragraph.component';
import dsStyles from '@digdir/designsystemet-css/alert.css?inline';

declare global {
  interface HTMLElementTagNameMap {
    'mid-alert': MinidAlert;
  }
}

const toastStack = Object.assign(document.createElement('div'), {
  className: 'mid-toast-stack',
});

const styles = [
  dsStyles,
  css`
    [hidden] {
      display: none !important;
    }

    .alert:has(.close-button) {
      padding-inline-end: 5.5rem;
    }

    .elevated {
      box-shadow: var(--ds-shadow-md);
    }

    .close-button {
      appearance: none;
      position: absolute;
      align-items: center;
      display: flex;
      right: 10px;
      top: 0;
      height: 100%;
      font-size: 24px;
    }

    .message-details {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      padding: 0.75rem;
      background-color: var(--ds-color-surface-hover);
      border-left: solid 4px var(--ds-color-surface-active);
    }

    .message-details pre {
      white-space: pre-wrap;
      word-break: break-all;
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
  @property({ reflect: true, attribute: 'data-color' })
  severity: 'warning' | 'info' | 'danger' | 'success' = 'info';

  /**
   * Sets size of icon, padding and font-size.
   */
  @property({ reflect: true, attribute: 'data-size' })
  size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Adds a shadow to elevate the component
   */
  @property({ type: Boolean })
  elevated = false;

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
    duration?: number,
    severity?: MinidAlert['severity'],
    closable = true
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
        this.setAttribute('data-color', this.severity);
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
    return html`
      <div
        part="base"
        class="${classMap({
          alert: true,
          'ds-alert': true,
          elevated: this.elevated,
        })}"
        data-color=${this.severity}
        @mouseenter=${this.pauseAutoHide}
        @mouseleave=${this.resumeAutoHide}
      >
        <div aria-live="polite">
          <slot>
            ${!this.notificationContent?.title
              ? nothing
              : html`
                  <mid-heading level="2" size="xs" spacing="2">
                    ${this.notificationContent?.title}
                  </mid-heading>
                `}
            ${this.notificationContent?.message}
            ${!this.notificationContent?.details
              ? nothing
              : html`<div class="message-details">
                  <pre>${this.notificationContent?.details}</pre>
                </div> `}
          </slot>
        </div>
        ${this.closable
          ? html`
              <mid-button
                iconstyled
                variant="tertiary"
                class="close-button"
                @click="${this.hide}"
              >
                <mid-icon name="xmark"> </mid-icon>
              </mid-button>
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
