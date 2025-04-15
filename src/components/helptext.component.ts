import { css, html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin.js';
import './icon/icon.component.js';
import './button.component.js';
import './popup.component.js';
import { waitForEvent } from '../internal/event.js';
import { MinidPopup } from './popup.component.js';
import { classMap } from 'lit/directives/class-map.js';
import { watch } from '../internal/watch.js';
import {
  getAnimation,
  setDefaultAnimation,
} from '../utilities/animation-registry.js';
import { stopAnimations, animateTo } from '../internal/animate.js';

declare global {
  interface HTMLElementTagNameMap {
    'mid-helptext': MinidHelptext;
  }
}

const styles = [
  css`
    :host {
      --max-width: 20rem;
    }
  `,
];

/**
 * @event mid-show - Emitted when open is set to `true`
 * @event mid-hide - Emitted when open is set to `false`
 * @event mid-after-show - Emitted after the helptext has shown an all animations are complete
 * @event mid-after-hide - Emitted after the helptext has hidden an all animations are complete
 *
 * @slot -- The default slot is for helptext content
 *
 * @cssproperty [--max-width=20rem] - Max width of the helptext content
 */
@customElement('mid-helptext')
export class MinidHelptext extends styled(LitElement, styles) {
  @query('#helptext-body')
  body!: HTMLElement;

  @query('mid-popup')
  popup!: MinidPopup;

  /**
   * Indicates whether or not the helptext is open. You can use this in lieu of the show/hide methods.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Size of the icon
   */
  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Placement of the popup
   */
  @property() placement:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end' = 'right';

  /**
   * The distance in pixels from which to offset the helptext away from its target.
   */
  @property({ type: Number })
  distance = 8;

  /**
   * The distance in pixels from which to offset the helptext along its target.
   */
  @property({ type: Number })
  skidding = 0;

  /**
   * Enable this option to prevent the helptext from being clipped when the component is placed inside a container with
   * `overflow: auto|hidden|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all,
   * scenarios.
   */
  @property({ type: Boolean })
  hoist = false;

  @state()
  filledIcon = false;

  constructor() {
    super();
    this.addEventListener('blur', this.handleBlur, true);
    this.addEventListener('focus', this.handleFocus, true);
    this.addEventListener('mouseover', this.handleMouseOver);
    this.addEventListener('mouseout', this.handleMouseOut);
  }

  disconnectedCallback() {
    // Cleanup this event in case the helptext is removed while open
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  async firstUpdated() {
    await this.updateComplete;
    this.body.hidden = !this.open;

    // If the helptext is visible on init, update its position
    if (this.open) {
      this.popup.active = true;
      this.filledIcon = true;
      this.popup.reposition();
    }
  }

  private handleBlur = () => {
    this.hide();
  };

  private handleClick = () => {
    if (this.open) {
      this.hide();
    } else {
      this.show();
    }
  };

  private handleFocus = () => {
    this.filledIcon = true;
  };

  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    // Pressing escape when a helptext is open should dismiss it
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.hide();
    }
  };

  private handleMouseOver = () => {
    this.filledIcon = true;
  };

  private handleMouseOut = () => {
    if (!this.open) {
      this.filledIcon = false;
    }
  };

  @watch('open', { waitUntilFirstUpdate: true })
  async handleOpenChange() {
    if (this.open) {
      // Show
      this.dispatchEvent(
        new Event('mid-show', { bubbles: true, composed: true })
      );

      document.addEventListener('keydown', this.handleDocumentKeyDown);

      await stopAnimations(this.body);
      this.body.hidden = false;
      this.popup.active = true;
      this.filledIcon = true;
      const { keyframes, options } = getAnimation(this, 'helptext.show');
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

      document.removeEventListener('keydown', this.handleDocumentKeyDown);

      this.filledIcon = false;
      await stopAnimations(this.body);
      const { keyframes, options } = getAnimation(this, 'helptext.hide');
      await animateTo(this.popup.popup, keyframes, options);
      this.popup.active = false;
      this.body.hidden = true;

      this.dispatchEvent(
        new Event('mid-after-hide', { bubbles: true, composed: true })
      );
    }
  }

  /**
   * Shows the helptext.
   */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, 'mid-after-show');
  }

  /**
   * Hides the helptext
   */
  async hide() {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    return waitForEvent(this, 'mid-after-hide');
  }

  override render() {
    const sm = this.size === 'sm';
    const md = this.size === 'md';
    const lg = this.size === 'lg';
    return html`
      <mid-popup
        class="[--arrow-border-color:var(--border-color-info)] [--arrow-color:var(--background-color-info-tinted)]"
        ?active=${this.open}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist ? 'fixed' : 'absolute'}
        flip-fallback-placements=${'top-end bottom-end'}
        flip
        arrow
        shift
        hover-bridge
      >
        <button
          slot="anchor"
          aria-describedby="helptext-body"
          aria-label="Hjelpetekst"
          class="${classMap({
            'text-6': sm,
            'text-7': md,
            'text-8': lg,
          })} text-accent-base focus-visible:focus-ring flex rounded-full"
          @click="${this.handleClick}"
        >
          <mid-icon
            name="questionmark-circle"
            library="system"
            class="${classMap({
              hidden: this.filledIcon,
            })}"
          ></mid-icon>
          <mid-icon
            name="questionmark-circle-fill"
            library="system"
            class="${classMap({
              hidden: !this.filledIcon,
            })}"
          ></mid-icon>
        </button>

        <div
          id="helptext-body"
          class="${classMap({
            'text-body-sm': sm,
            'text-body-md': md,
            'text-body-lg': lg,
          })} bg-info-tinted text-info border-info w-max max-w-(--max-width) rounded border px-4 py-3"
          aria-live=${this.open ? 'polite' : 'off'}
          role="status"
        >
          <slot></slot>
        </div>
      </mid-popup>
    `;
  }
}

setDefaultAnimation('helptext.show', {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 },
  ],
  options: { duration: 150, easing: 'ease' },
});

setDefaultAnimation('helptext.hide', {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 },
  ],
  options: { duration: 150, easing: 'ease' },
});
