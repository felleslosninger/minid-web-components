import { html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from '../mixins/tailwind.mixin.ts';
import './icon/icon.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { watch } from '../internal/watch';
import {
  getAnimation,
  setDefaultAnimation,
} from '../utilities/animation-registry';
import { waitForEvent } from '../internal/event';
import { animateTo, stopAnimations } from '../internal/animate';
import { type MidIconName } from '../types/icon-name';

declare global {
  interface HTMLElementTagNameMap {
    'mid-alert': MinidAlert;
  }
}

const toastStack = Object.assign(document.createElement('div'), {
  className: 'mid-toast-stack',
});

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
export class MinidAlert extends styled(LitElement) {
  private autoHideTimeout?: number;
  private remainingTimeInterval?: number;

  @query('[part~="base"]')
  private base!: HTMLElement;

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
  private notificationContent?: {
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
    const sm = this.size === 'sm';
    const md = this.size === 'md';
    const lg = this.size === 'lg';
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
          'text-body-sm': sm,
          'text-body-md': md,
          'text-body-lg': lg,
          'bg-danger-surface-tinted': danger,
          'bg-info-surface-tinted': info,
          'bg-success-surface-tinted': success,
          'bg-warning-surface-tinted': warning,
          'border-danger': danger,
          'border-info': info,
          'border-success': success,
          'border-warning': warning,
          'text-danger': danger,
          'text-info': info,
          'text-success': success,
          'text-warning': warning,
          'shadow-md': this.elevated,
        })} grid grid-cols-[auto_1fr_auto] gap-2 rounded border p-6"
        @mouseenter=${this.pauseAutoHide}
        @mouseleave=${this.resumeAutoHide}
      >
        <mid-icon
          class="${classMap({
            'text-info-subtle': info,
            'text-danger-subtle': danger,
            'text-success-subtle': success,
            'text-warning-subtle': warning,
          })} size-7"
          name="${iconName}"
          library="system"
          alt=${ifDefined(this.iconlabel)}
        ></mid-icon>
        <div aria-live="polite">
          <slot>
            ${!this.notificationContent?.title
              ? nothing
              : html`<h2 class="text-heading-xs">
                  ${this.notificationContent?.title}
                </h2>`}
            ${this.notificationContent?.message}
            ${!this.notificationContent?.details
              ? nothing
              : html`<div
                  class="${classMap({
                    'border-danger': danger,
                    'border-info': info,
                    'border-success': success,
                    'border-warning': warning,
                    'bg-danger-surface-hover': danger,
                    'bg-info-surface-hover': info,
                    'bg-success-surface-hover': success,
                    'bg-warning-surface-hover': warning,
                  })} text-body-sm mt-0.5 border-l-4 p-3"
                >
                  <pre class="break-all whitespace-pre-wrap">
${this.notificationContent?.details}</pre
                  >
                </div>`}
          </slot>
        </div>
        ${this.closable
          ? html`
              <button
                class="${classMap({
                  'text-info-subtle': info,
                  'text-danger-subtle': danger,
                  'text-success-subtle': success,
                  'text-warning-subtle': warning,
                  'hover:bg-danger-surface-hover': danger,
                  'hover:bg-info-surface-hover': info,
                  'hover:bg-success-surface-hover': success,
                  'hover:bg-warning-surface-hover': warning,
                })} -my-4 -mr-4 flex self-center rounded p-4"
                @click="${this.hide}"
              >
                <mid-icon class="size-6" name="xmark"> </mid-icon>
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
