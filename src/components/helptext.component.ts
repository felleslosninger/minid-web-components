import { css, html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin.js';
import 'components/icon/icon.component.js';
import 'components/button.component.js';
import 'components/popup.component.js';
import { waitForEvent } from 'src/internal/event.js';
import { MinidPopup } from 'components/popup.component.js';
import { classMap } from 'lit/directives/class-map.js';
import { watch } from 'src/internal/watch.js';
import {
  getAnimation,
  setDefaultAnimation,
} from 'src/components/utilities/animation-registry.js';
import { stopAnimations, animateTo } from 'src/internal/animate.js';

const styles = [
  css`
    :host {
      --icon-size: 1.75rem;
      --max-width: 20rem;
    }

    mid-icon {
      font-size: var(--icon-size);
      color: var(--fds-semantic-text-action-default);
    }

    .fds-helptext--md {
      --icon-size: 3rem;
    }

    .helptext__body {
      width: max-content;
      max-width: var(--max-width);
    }

    .popup::part(arrow) {
      border: 1px solid var(--fds-semantic-border-info-default);
      border-left: 0;
      border-top: 0;
      z-index: 1001;
    }

    .popup[placement^='top']::part(arrow) {
      transform: rotate(0deg);
    }

    .popup[placement^='bottom']::part(arrow) {
      transform: rotate(180deg);
    }

    .popup[placement^='left']::part(arrow) {
      transform: rotate(-90deg);
    }

    .popup[placement^='right']::part(arrow) {
      transform: rotate(90deg);
    }

    .popup::part(popup) {
      --arrow-color: var(--fds-semantic-surface-info-subtle);
      z-index: 1000;
    }

    .popup[placement^='top']::part(popup) {
      transform-origin: bottom;
    }

    .popup[placement^='bottom']::part(popup) {
      transform-origin: top;
    }

    .popup[placement^='left']::part(popup) {
      transform-origin: right;
    }

    .popup[placement^='right']::part(popup) {
      transform-origin: left;
    }
  `,
];

@customElement('mid-helptext')
export class MinidHelptext extends styled(LitElement, styles) {
  /**
   * @ignore
   */
  @query('.helptext__body')
  body!: HTMLElement;

  /**
   * @ignore
   */
  @query('mid-popup')
  popup!: MinidPopup;

  /**
   * Indicates whether or not the tooltip is open. You can use this in lieu of the show/hide methods.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * @typedef {pla}
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
   * The distance in pixels from which to offset the tooltip away from its target.
   */
  @property({ type: Number })
  distance = 8;

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

  @state()
  filledIcon = false;

  #animating = false;

  constructor() {
    super();
    this.addEventListener('blur', this.handleBlur, true);
    this.addEventListener('focus', this.handleFocus, true);
    this.addEventListener('mouseover', this.handleMouseOver);
    this.addEventListener('mouseout', this.handleMouseOut);
  }

  /**
   * @ignore
   */
  private handleBlur = () => {
    this.hide();
  };

  /**
   * @ignore
   */
  private handleClick = () => {
    if (this.#animating) {
      return;
    }

    if (this.open) {
      this.hide();
    } else {
      this.show();
    }
  };

  /**
   * @ignore
   */
  private handleFocus = () => {
    this.show();
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
    this.filledIcon = true;
  };

  /**
   * @ignore
   */
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
      this.#animating = true;
      const { keyframes, options } = getAnimation(this, 'helptext.show');
      await animateTo(this.popup.popup, keyframes, options);
      this.#animating = false;
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

      await stopAnimations(this.body);
      this.#animating = true;
      const { keyframes, options } = getAnimation(this, 'helptext.hide');
      await animateTo(this.popup.popup, keyframes, options);
      this.popup.active = false;
      this.body.hidden = true;
      this.filledIcon = false;
      this.#animating = false;

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
    return html`
      <mid-popup
        role="tooltip"
        class="popup"
        ?active=${this.open}
        placement="right"
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist ? 'fixed' : 'absolute'}
        flip
        shift
        arrow
        hover-bridge
      >
        <button
          slot="anchor"
          class="fds-helptext--md fds-helptext__button fds-focus"
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
          class="helptext__body fds-paragraph fds-paragraph--md fds-popover fds-popover--info fds-popover--md fds-helptext__content"
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
