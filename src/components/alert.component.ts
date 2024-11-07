import { css, html, LitElement } from 'lit';
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
  `,
];

/**
 */

@customElement('mid-alert')
export class MinidAlert extends styled(LitElement, styles) {
  private autoHideTimeout?: number;
  private remainingTimeInterval?: number;
  private countdownAnimation?: Animation;

  @query('[part~="base"]')
  base!: HTMLElement;

  @query('.alert__countdown-elapsed')
  countdownElement!: HTMLElement;

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
    this.countdownAnimation?.pause();
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
      this.countdownAnimation?.play();
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
  async toast() {
    return new Promise<void>((resolve) => {
      if (toastStack.parentElement === null) {
        document.body.append(toastStack);
      }

      toastStack.appendChild(this);

      const { keyframes, options } = getAnimation(
        this,
        'toast-stack.new-alert'
      );
      animateTo(toastStack, keyframes, options);

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
          <slot></slot>
        </div>
      </div>
    `;
  }
}

setDefaultAnimation('toast-stack.new-alert', {
  keyframes: [
    { transform: 'translateY(100px)' },
    { transform: 'translateY(0px)' },
  ],
  options: { duration: 250, easing: 'ease-out' },
});

setDefaultAnimation('alert.show', {
  keyframes: [
    { opacity: 0, scale: 1, transform: 'translateY(100px)' },
    { opacity: 1, scale: 1, transform: 'translateY(0px)' },
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
