import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin.js';
import './popup.component';
import { classMap } from 'lit/directives/class-map.js';
import { MinidPopup } from './popup.component';
import { watch } from '../internal/watch.js';
import {
  animateTo,
  parseDuration,
  stopAnimations,
} from '../internal/animate.js';
import {
  getAnimation,
  setDefaultAnimation,
} from '../utilities/animation-registry.js';
import { waitForEvent } from '../internal/event.js';

declare global {
  interface HTMLElementTagNameMap {
    'mid-tooltip': MinidTooltip;
  }
}

const styles = [
  css`
    :host {
      --max-width: 20rem;
      --hide-delay: 0ms;
      --show-delay: 250ms;
    }

    .tooltip__body {
      width: max-content;
      max-width: var(--max-width);
    }

    .tooltip {
      --arrow-color: var(--fds-semantic-surface-neutral-inverted);
    }

    .tooltip.inverted {
      --arrow-color: var(--fds-semantic-surface-neutral-subtle);
    }
  `,
];

/**
 * @event mid-show - Emitted when open is set to `true`
 * @event mid-hide - Emitted when open is set to `false`
 * @event mid-after-show - Emitted after the tooltip has shown an all animations are complete
 * @event mid-after-hide - Emitted after the tooltip has hidden an all animations are complete
 *
 * @slot -- The default slot is for the trigger element
 * @slot content - The content to render in the tooltip. Alternatively, you can use the `content` attribute.
 *
 * @csspart base - The component base wrapper. `<mid-popup> element
 * @csspart body - The tooltip body, where the content is rendered
 *
 * @cssproperty [--max-width=20rem] - Max width of the tooltip content
 * @cssproperty [--hide-delay=0ms] - Delay for hiding the tooltip
 * @cssproperty [--show-delay=150ms] - Delay for showing the tooltip
 */
@customElement('mid-tooltip')
export class MinidTooltip extends styled(LitElement, styles) {
  /**
   * @ignore
   */
  private hoverTimeout?: number;
  /**
   * @ignore
   */
  private closeWatcher: CloseWatcher | null = null;

  /**
   * @ignore
   */
  @query('slot:not([name])')
  defaultSlot!: HTMLSlotElement;

  /**
   * @ignore
   */
  @query('.tooltip__body')
  body!: HTMLElement;

  /**
   * @ignore
   */
  @query('mid-popup')
  popup!: MinidPopup;

  /**
   * The text to render in the tooltip. If you need HTML you can use the content slot
   */
  @property()
  content = '';

  /**
   * Controls how the tooltip is activated. When manual is used, the tooltip must be activated
   * programmatically.
   */
  @property({ type: String })
  trigger: 'focus hover' | 'hover' | 'focus' | 'manual' | 'click' =
    'focus hover';

  @property() placement:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end' = 'top';

  /**
   * Disables the tooltip so it won't show when triggered.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * The distance in pixels from which to offset the tooltip away from its target.
   */
  @property({ type: Number })
  distance = 8;

  /**
   * Indicates whether or not the tooltip is open. You can use this in lieu of the show/hide methods.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * The distance in pixels from which to offset the tooltip along its target.
   */
  @property({ type: Number })
  skidding = 0;

  /**
   * Enable this option to prevent the tooltip from being clipped when the component is placed inside a container with
   * `overflow: auto|hidden|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all,
   * scenarios.
   */
  @property({ type: Boolean })
  hoist = false;

  /**
   * Inverts the color of the tooltip. Use this on dark backgrounds.
   */
  @property({ type: Boolean })
  inverted = false;

  constructor() {
    super();
    this.addEventListener('blur', this.handleBlur, true);
    this.addEventListener('focus', this.handleFocus, true);
    this.addEventListener('click', this.handleClick);
    this.addEventListener('mouseover', this.handleMouseOver);
    this.addEventListener('mouseout', this.handleMouseOut);
  }

  disconnectedCallback() {
    // Cleanup this event in case the tooltip is removed while open
    this.closeWatcher?.destroy();
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  firstUpdated() {
    this.body.hidden = !this.open;

    // If the tooltip is visible on init, update its position
    if (this.open) {
      this.popup.active = true;
      this.popup.reposition();
    }
  }

  /**
   * @ignore
   */
  private handleBlur = () => {
    if (this.hasTrigger('focus')) {
      this.hide();
    }
  };

  /**
   * @ignore
   */
  private handleClick = () => {
    if (this.hasTrigger('click')) {
      if (this.open) {
        this.hide();
      } else {
        this.show();
      }
    }
  };

  /**
   * @ignore
   */
  private handleFocus = () => {
    if (this.hasTrigger('focus')) {
      this.show();
    }
  };

  /**
   * @ignore
   */
  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    // Pressing escape when a tooltip is open should dismiss it
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.hide();
    }
  };

  /**
   * @ignore
   */
  private handleMouseOver = () => {
    if (this.hasTrigger('hover')) {
      const delay = parseDuration(
        getComputedStyle(this).getPropertyValue('--show-delay')
      );
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = window.setTimeout(() => this.show(), delay);
    }
  };

  /**
   * @ignore
   */
  private handleMouseOut = () => {
    if (this.hasTrigger('hover')) {
      const delay = parseDuration(
        getComputedStyle(this).getPropertyValue('--hide-delay')
      );
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = window.setTimeout(() => this.hide(), delay);
    }
  };

  /**
   * @ignore
   */
  private hasTrigger(triggerType: string) {
    const triggers = this.trigger.split(' ');
    return triggers.includes(triggerType);
  }

  @watch('open', { waitUntilFirstUpdate: true })
  async handleOpenChange() {
    if (this.open) {
      if (this.disabled) {
        return;
      }

      // Show
      this.dispatchEvent(
        new Event('mid-show', { bubbles: true, composed: true })
      );
      if ('CloseWatcher' in window) {
        this.closeWatcher?.destroy();
        this.closeWatcher = new CloseWatcher();
        this.closeWatcher.onclose = () => {
          this.hide();
        };
      } else {
        document.addEventListener('keydown', this.handleDocumentKeyDown);
      }

      await stopAnimations(this.body);
      this.body.hidden = false;
      this.popup.active = true;
      const { keyframes, options } = getAnimation(this, 'tooltip.show');
      await animateTo(this.popup.popup, keyframes, options);
      this.popup.reposition();

      this.dispatchEvent(
        new Event('mid-after-show', { bubbles: true, composed: true })
      );
    } else {
      // Hide
      this.dispatchEvent(
        new Event('mid-hide', { bubbles: true, composed: true })
      );
      this.closeWatcher?.destroy();
      document.removeEventListener('keydown', this.handleDocumentKeyDown);

      await stopAnimations(this.body);
      const { keyframes, options } = getAnimation(this, 'tooltip.hide');
      await animateTo(this.popup.popup, keyframes, options);
      this.popup.active = false;
      this.body.hidden = true;

      this.dispatchEvent(
        new Event('mid-after-hide', { bubbles: true, composed: true })
      );
    }
  }

  @watch(['content', 'distance', 'hoist', 'placement', 'skidding'])
  async handleOptionsChange() {
    if (this.hasUpdated) {
      await this.updateComplete;
      this.popup.reposition();
    }
  }

  @watch('disabled')
  handleDisabledChange() {
    if (this.disabled && this.open) {
      this.hide();
    }
  }

  /**
   * Shows the tooltip.
   */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, 'mid-after-show');
  }

  /**
   * Hides the tooltip
   */
  async hide() {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    return waitForEvent(this, 'mid-after-hide');
  }

  override render() {
    return html`
      <mid-popup
        role="tooltip"
        ?active=${this.open}
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${classMap({
          tooltip: true,
          inverted: this.inverted,
          'tooltip--open': this.open,
        })}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist ? 'fixed' : 'absolute'}
        flip
        shift
        arrow
        hover-bridge
      >
        <slot slot="anchor"></slot>
        <div
          part="body"
          id="tooltip"
          class="${classMap({
            'fds-tooltip': true,
            tooltip__body: true,
            'fds-tooltip--inverted': this.inverted,
          })}"
          role="tooltip"
          aria-live=${this.open ? 'polite' : 'off'}
        >
          <slot name="content">${this.content}</slot>
        </div>
      </mid-popup>
    `;
  }
}

setDefaultAnimation('tooltip.show', {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 },
  ],
  options: { duration: 150, easing: 'ease' },
});

setDefaultAnimation('tooltip.hide', {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 },
  ],
  options: { duration: 150, easing: 'ease' },
});
