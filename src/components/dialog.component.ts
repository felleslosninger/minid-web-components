import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { waitForEvent } from '../internal/event';
import { watch } from '../internal/watch';
import { styled } from '../mixins/tailwind.mixin';
import './icon/icon.component';
import {
  getAnimation,
  setDefaultAnimation,
} from '../utilities/animation-registry';
import { animateTo, stopAnimations } from '../internal/animate';
import { lockBodyScrolling, unlockBodyScrolling } from '../internal/scroll';

declare global {
  interface HTMLElementTagNameMap {
    'mid-dialog': MinidDialog;
  }
}

const styles = [
  css`
    :host {
      --width: 40rem;
      display: block;
    }
  `,
];

/**
 *
 * @event mid-show - Emitted when the dialog opens.
 * @event mid-after-show - Emitted after the dialog opens and all animations are complete.
 * @event mid-hide - Emitted when the dialog closes.
 * @event mid-after-hide - Emitted after the dialog closes and all animations are complete.
 * @event {{ source: 'close-button' | 'keyboard' | 'overlay' }} mid-request-close - Emitted when the user attempts to
 *   close the dialog by clicking the close button, clicking the overlay, or pressing escape. Calling
 *   `event.preventDefault()` will keep the dialog open. Avoid using this unless closing the dialog will result in
 *   destructive behavior such as data loss.
 *
 * @csspart base - Select the base `dialog` element
 * @csspart header - Select the `header` element
 * @csspart body - Select the `article` element
 * @csspart footer - Select the `footer` element
 *
 * @slot -- The default slot for the body content of the dialog
 * @slot heading - The content inside the `h2` element
 * @slot footer - The content inside the `footer` element
 *
 * @animation dialog.show - The animation to use when showing the dialog.
 * @animation dialog.hide - The animation to use when hiding the dialog.
 * @animation dialog.denyClose - The animation to use when closing the dialog is prevented.
 *
 */
@customElement('mid-dialog')
export class MinidDialog extends styled(LitElement, styles) {
  @query('#dialog')
  dialog!: HTMLDialogElement;

  /**
   * Indicates whether or not the dialog is open. You can toggle this attribute to show and hide the dialog, or you can
   * use the `show()` and `hide()` methods and this attribute will reflect the dialog's open state.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * The dialog's label as displayed in the header. You should always include a relevant label even when using
   * `no-header`, as it is required for proper accessibility. If you need to display HTML, use the `label` slot instead.
   */
  @property({ reflect: true })
  heading = '';

  private requestClose(source: 'close-button' | 'keyboard' | 'overlay') {
    const requestCloseEvent = new CustomEvent('mid-request-close', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { source },
    });
    this.dispatchEvent(requestCloseEvent);

    if (requestCloseEvent.defaultPrevented) {
      const { keyframes, options } = getAnimation(this, 'dialog.denyClose');
      animateTo(this.dialog, keyframes, options);
      return;
    }

    this.hide();
  }

  handleDialogCancel = (event: Event) => {
    event.preventDefault();

    if (event.defaultPrevented) {
      this.requestClose('keyboard');
    } else {
      this.hide();
    }
  };

  private handleBackdropClick({ target }: Event) {
    // if the target is the dialog, the backdrop was clicked
    if (target === this.dialog) {
      this.requestClose('overlay');
    }
  }

  @watch('open', { waitUntilFirstUpdate: true })
  async handleOpenChange() {
    if (this.open) {
      // Show
      this.dispatchEvent(
        new Event('mid-show', { composed: true, bubbles: true })
      );
      // this.addOpenListeners();
      this.dialog.showModal();

      lockBodyScrolling(this);

      const panelAnimation = getAnimation(this, 'dialog.show');
      await animateTo(
        this.dialog,
        panelAnimation.keyframes,
        panelAnimation.options
      ),
        this.dispatchEvent(
          new Event('mid-after-show', { bubbles: true, composed: true })
        );
    } else {
      // Hide
      this.dispatchEvent(
        new Event('mid-hide', { bubbles: true, composed: true })
      );

      await Promise.all([stopAnimations(this.dialog)]);
      const panelAnimation = getAnimation(this, 'dialog.hide');

      // The backdrop can only be animated with css because it's a pseudo element
      // so we add a animation class to trigger it at the same time as the dialog animation
      this.dialog.classList.add('backdrop:animate-fade-out');
      await animateTo(
        this.dialog,
        panelAnimation.keyframes,
        panelAnimation.options
      );
      this.dialog.classList.remove('backdrop:animate-fade-out');
      this.dialog.close();
      this.dialog.hidden = false;
      unlockBodyScrolling(this);
      this.dispatchEvent(
        new Event('mid-after-hide', { composed: true, bubbles: true })
      );
    }
  }

  /**
   * Shows the dialog.
   */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, 'mid-after-show');
  }

  /**
   * Hides the dialog
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
      <dialog
        part="base"
        id="dialog"
        class="text-body-md text-neutral m-auto max-h-[calc(100%---spacing(8))] w-(--width) max-w-[calc(100%---spacing(8))] flex-col rounded-lg p-6 shadow-xl backdrop:bg-black/50 open:flex open:animate-none"
        @cancel=${this.handleDialogCancel}
        @click=${this.handleBackdropClick}
      >
        <header part="header" class="text-heading-sm flex justify-between">
          <slot name="heading"></slot>
          <div class="h-0">
            <button
              autofocus
              @click="${() => this.requestClose('close-button')}"
              class="text-body-md focus-visible:focus-ring text-neutral hover:bg-neutral-surface-hover float-right flex size-12 -translate-y-3 translate-x-3 items-center justify-center rounded"
            >
              <mid-icon class="size-6" name="xmark"></mid-icon>
            </button>
          </div>
        </header>
        <div part="body" class="overflow-auto">
          <slot> </slot>
        </div>
        <footer part="footer">
          <slot name="footer"> </slot>
        </footer>
      </dialog>
    `;
  }
}

setDefaultAnimation('dialog.show', {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 },
  ],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('dialog.hide', {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 },
  ],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('dialog.denyClose', {
  keyframes: [{ scale: 1 }, { scale: 1.03 }, { scale: 1 }],
  options: { duration: 100 },
});
