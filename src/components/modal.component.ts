import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { waitForEvent } from 'src/internal/event';
import { watch } from 'src/internal/watch';
import { styled } from 'src/mixins/tailwind.mixin';
import './icon/icon.component';
import {
  getAnimation,
  setDefaultAnimation,
} from 'src/components/utilities/animation-registry';
import { animateTo, stopAnimations } from 'src/internal/animate';
import { lockBodyScrolling, unlockBodyScrolling } from 'src/internal/scroll';

const styles = [
  css`
    :host {
      --max-width: 40rem;
      --footer-and-header-height: 140px;
      display: contents;
    }

    .dialog {
      max-width: var(--max-width);
      flex: 1 1 auto;
      display: block;
      max-height: unset;
      padding: var(--body-spacing);
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

    .close-button mid-icon {
      font-size: 1.75rem;
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
 * @csspart base - Select the base `dialog` element
 * @csspart header - Select the `h2` element
 * @csspart body - Select the `article` element
 * @csspart footer - Select the `footer` element
 */
@customElement('mid-modal')
export class MinidModal extends styled(LitElement, styles) {
  private closeWatcher?: CloseWatcher;

  @query('#dialog')
  dialog!: HTMLDialogElement;

  @query('.dialog')
  panel!: HTMLElement;

  @property({ type: Boolean })
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
      animateTo(this.panel, keyframes, options);
      return;
    }

    this.hide();
  }

  private addOpenListeners() {
    if ('CloseWatcher' in window) {
      this.closeWatcher?.destroy();
      this.closeWatcher = new CloseWatcher();
      this.closeWatcher.onclose = () => this.requestClose('keyboard');
    } else {
      document.addEventListener('keydown', this.handleDocumentKeyDown);
    }
  }

  private removeOpenListeners() {
    this.closeWatcher?.destroy();
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.open) {
      event.stopPropagation();
      this.requestClose('keyboard');
    }
  };

  handleDialogCancel(event: Event) {
    event.preventDefault();
    this.requestClose('keyboard');
  }

  handleBackdropClick({ target }: Event) {
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
      this.addOpenListeners();
      this.dialog.showModal();

      lockBodyScrolling(this);

      const panelAnimation = getAnimation(this, 'dialog.show');
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
      this.removeOpenListeners();
      // this.dialog.close();

      await Promise.all([
        stopAnimations(this.dialog),
        // stopAnimations(this.overlay),
      ]);
      const panelAnimation = getAnimation(this, 'dialog.hide');

      // The backdrop can only be animated with css because it's a pseudo element
      // so we add a closing class to trigger it at the same time as the dialog animation
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
        class="dialog fds-modal"
        @cancel=${this.handleDialogCancel}
        @click=${this.handleBackdropClick}
      >
        <header part="header" class="fds-modal__header flex">
          <h2 class="fds-heading fds-heading--xs">
            <slot name="heading"></slot>
          </h2>
          <button
            autofocus
            @click="${() => this.requestClose('close-button')}"
            class="close-button fds-btn fds-focus fds-btn--md fds-btn--tertiary fds-btn--second fds-btn--icon-only fds-modal__header__button"
          >
            <mid-icon name="xmark"></mid-icon>
          </button>
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
