import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { waitForEvent } from '../internal/event';
import { watch } from '../internal/watch';
import { styled } from '../mixins/tailwind.mixin';
import './icon/icon.component';
import './button.component';
import {
  getAnimation,
  setDefaultAnimation,
} from '../utilities/animation-registry';
import { animateTo, stopAnimations } from '../internal/animate';
import { lockBodyScrolling, unlockBodyScrolling } from '../internal/scroll';
import dialogStyles from '@digdir/designsystemet-css/dialog.css?inline';

declare global {
  interface HTMLElementTagNameMap {
    'mid-dialog': MinidDialog;
  }
}

const styles = [
  dialogStyles,
  css`
    :host {
      --max-width: 40rem;
      --footer-and-header-height: 140px;
      display: contents;
    }

    header {
      display: flex;
    }

    .close-button {
      place-self: flex-end;
      margin-left: auto;
      margin-bottom: 0.25rem;
      transform: translate(0.25rem, -0.25rem);
    }

    .close-button > mid-icon {
      font-size: 1.75rem;
    }

    .dialog {
      max-width: var(--max-width);
      max-height: unset;
    }

    .dialog[open] {
      animation: none;
    }

    .dialog.closing::backdrop {
      animation: fade-out 200ms ease-in forwards;
    }

    .modal-content {
      max-height: calc(90vh - var(--footer-and-header-height));
      overflow: auto;
    }

    .footer {
      justify-content: flex-end;
    }

    @keyframes fade-out {
      from {
        opacity: 1;
      }

      to {
        opacity: 0;
      }
    }
  `,
];

/**
 *
 * @event mid-show - Emitted when the modal opens.
 * @event mid-after-show - Emitted after the modal opens and all animations are complete.
 * @event mid-hide - Emitted when the modal closes.
 * @event mid-after-hide - Emitted after the modal closes and all animations are complete.
 * @event {{ source: 'close-button' | 'keyboard' | 'overlay' }} mid-request-close - Emitted when the user attempts to
 *   close the modal by clicking the close button, clicking the overlay, or pressing escape. Calling
 *   `event.preventDefault()` will keep the dialog open. Avoid using this unless closing the dialog will result in
 *   destructive behavior such as data loss.
 *
 * @csspart base - Select the base `dialog` element
 * @csspart header - Select the `header` element
 * @csspart body - Select the `article` element
 * @csspart footer - Select the `footer` element
 *
 * @slot -- The default slot for the body content of the modal
 * @slot heading - The content inside the `h2` element
 * @slot footer - The content inside the `footer` element
 *
 * @animation modal.show - The animation to use when showing the modal.
 * @animation modal.hide - The animation to use when hiding the modal.
 * @animation modal.denyClose - The animation to use when closing the modal is prevented.
 *
 */
@customElement('mid-dialog')
export class MinidDialog extends styled(LitElement, styles) {
  @query('#dialog')
  dialog!: HTMLDialogElement;

  @query('.dialog')
  panel!: HTMLElement;

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
      const { keyframes, options } = getAnimation(this, 'modal.denyClose');
      animateTo(this.panel, keyframes, options);
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

      const panelAnimation = getAnimation(this, 'modal.show');
      await animateTo(
        this.panel,
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
      const panelAnimation = getAnimation(this, 'modal.hide');

      // The backdrop can only be animated with css because it's a pseudo element
      // so we add a closing class to trigger it at the same time as the modal animation
      this.panel.classList.add('closing');
      await animateTo(
        this.panel,
        panelAnimation.keyframes,
        panelAnimation.options
      );
      this.panel.classList.remove('closing');
      this.dialog.close();
      this.panel.hidden = false;
      unlockBodyScrolling(this);
      this.dispatchEvent(
        new Event('mid-after-hide', { composed: true, bubbles: true })
      );
    }
  }

  /**
   * Shows the modal.
   */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, 'mid-after-show');
  }

  /**
   * Hides the modal
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
        class="dialog fds-modal ds-dialog m-auto"
        data-modal="true"
        @cancel=${this.handleDialogCancel}
        @click=${this.handleBackdropClick}
      >
        <header part="header" class="fds-modal__header flex">
          <slot name="heading"></slot>
          <mid-button
            class="close-button"
            autofocus
            @click="${() => this.requestClose('close-button')}"
            iconstyled
            variant="tertiary"
            data-color="neutral"
            data-size="sm"
          >
            <mid-icon class="text-[1.75rem]" name="xmark"></mid-icon>
          </mid-button>
        </header>
        <article part="body" class="fds-modal__content modal-content">
          <slot> </slot>
        </article>
        <footer part="footer" class="fds-modal__footer footer">
          <slot name="footer"> </slot>
        </footer>
      </dialog>
    `;
  }
}

setDefaultAnimation('modal.show', {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 },
  ],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('modal.hide', {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 },
  ],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('modal.denyClose', {
  keyframes: [{ scale: 1 }, { scale: 1.03 }, { scale: 1 }],
  options: { duration: 100 },
});
