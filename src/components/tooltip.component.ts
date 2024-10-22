import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styled } from 'src/mixins/tailwind.mixin.js';
import './popup.component';
import { classMap } from 'lit/directives/class-map.js';
import { MinidPopup } from './popup.component';
import { watch } from '../internal/watch.js';

type TriggerType = 'hover' | 'focus' | 'manual' | 'click';

interface CloseWatcher extends EventTarget {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (options?: CloseWatcherOptions): CloseWatcher;
  requestClose(): void;
  close(): void;
  destroy(): void;

  oncancel: (event: Event) => void | null;
  onclose: (event: Event) => void | null;
}

declare const CloseWatcher: CloseWatcher;

interface CloseWatcherOptions {
  signal: AbortSignal;
}

declare interface Window {
  CloseWatcher?: CloseWatcher;
}

const styles = [
  css`
    ::part(arrow) {
      background-color: var(--fds-semantic-surface-neutral-inverted);
    }
    .fds-tooltip {
      width: max-content;
    }
  `,
];

@customElement('mid-tooltip')
export class MinidTooltip extends styled(LitElement, styles) {
  private hoverTimeout?: number;
  private closeWatcher: CloseWatcher | null = null;

  @query('slot:not([name])')
  defaultSlot!: HTMLSlotElement;

  @query('.tooltip__body')
  body!: HTMLElement;

  @query('sl-popup')
  popup!: MinidPopup;

  @property()
  content = '';

  /**
   * Controls how the tooltip is activated. Possible options include `click`, `hover`, `focus`, and `manual`. Multiple
   * options can be passed by separating them with a space. When manual is used, the tooltip must be activated
   * programmatically.
   * @type hover | focus | click | manual
   */
  @property({ type: String })
  trigger:
    | TriggerType
    | `${TriggerType} ${TriggerType}`
    | `${TriggerType} ${TriggerType} ${TriggerType}` = 'hover focus';

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

  private handleBlur = () => {
    if (this.hasTrigger('focus')) {
      this.hide();
    }
  };

  private handleClick = () => {
    if (this.hasTrigger('click')) {
      if (this.open) {
        this.hide();
      } else {
        this.show();
      }
    }
  };

  private handleFocus = () => {
    if (this.hasTrigger('focus')) {
      this.show();
    }
  };

  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    // Pressing escape when a tooltip is open should dismiss it
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.hide();
    }
  };

  private handleMouseOver = () => {
    if (this.hasTrigger('hover')) {
      this.show();
      //   const delay = parseDuration(
      //     getComputedStyle(this).getPropertyValue('--show-delay')
      //   );
      //   clearTimeout(this.hoverTimeout);
      //   this.hoverTimeout = window.setTimeout(() => this.show(), delay);
    }
  };

  private handleMouseOut = () => {
    if (this.hasTrigger('hover')) {
      this.hide();
      //   const delay = parseDuration(
      //     getComputedStyle(this).getPropertyValue('--hide-delay')
      //   );
      //   clearTimeout(this.hoverTimeout);
      //   this.hoverTimeout = window.setTimeout(() => this.hide(), delay);
    }
  };

  private hasTrigger(triggerType: string) {
    const triggers = this.trigger.split(' ');
    return triggers.includes(triggerType);
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

  /** Shows the tooltip. */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    // return waitForEvent(this, 'sl-after-show');
  }

  /** Hides the tooltip */
  async hide() {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    // return waitForEvent(this, 'sl-after-hide');
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
          class="fds-tooltip"
          role="tooltip"
          aria-live=${this.open ? 'polite' : 'off'}
        >
          <slot name="content">${this.content}</slot>
        </div>
      </mid-popup>
    `;
  }
}
