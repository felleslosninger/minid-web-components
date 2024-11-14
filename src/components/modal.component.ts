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

const styles = [
  css`
    .dialog[open] {
      animation: none;
    }

    .dialog.closing::backdrop {
      animation: fade-out 200ms ease-in forwards;
    }

    @keyframes fade-out {
      from {
        opacity: 1;
      }

      to {
        opacity: 0;
      }
    }

    .footer {
      justify-content: flex-end;
    }

    .close-button mid-icon {
      font-size: 1.75rem;
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

  @watch('open', { waitUntilFirstUpdate: true })
  async handleOpenChange() {
    if (this.open) {
      // Show
      this.dispatchEvent(
        new Event('mid-show', { composed: true, bubbles: true })
      );
      this.addOpenListeners();
      // this.originalTrigger = document.activeElement as HTMLElement;
      this.dialog.showModal();

      // lockBodyScrolling(this); TODO

      // When the dialog is shown, Safari will attempt to set focus on whatever element has autofocus. This can cause
      // the dialogs's animation to jitter (if it starts offscreen), so we'll temporarily remove the attribute, call
      // `focus({ preventScroll: true })` ourselves, and add the attribute back afterwards.
      //
      // Related: https://github.com/shoelace-style/shoelace/issues/693
      //
      // const autoFocusTarget = this.querySelector('[autofocus]');
      // if (autoFocusTarget) {
      //   autoFocusTarget.removeAttribute('autofocus');
      // }

      // await Promise.all([
      //   stopAnimations(this.dialog),
      //   // stopAnimations(this.overlay),
      // ]);
      // this.dialog.showModal();

      // // Set initial focus
      // requestAnimationFrame(() => {
      //   const initialFocusEvent = new Event('mid-initial-focus', {
      //     composed: true,
      //     bubbles: true,
      //     cancelable: true,
      //   });
      //   this.dispatchEvent(initialFocusEvent);

      //   if (!initialFocusEvent.defaultPrevented) {
      //     // Set focus to the autofocus target and restore the attribute
      //     if (autoFocusTarget) {
      //       (autoFocusTarget as HTMLInputElement).focus({
      //         preventScroll: true,
      //       });
      //     } else {
      //       this.panel.focus({ preventScroll: true });
      //     }
      //   }

      //   // Restore the autofocus attribute
      //   if (autoFocusTarget) {
      //     autoFocusTarget.setAttribute('autofocus', '');
      //   }
      // });

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

      // Now that the dialog is hidden, restore the overlay and panel for next time
      // this.overlay.hidden = false;
      this.panel.hidden = false;

      // unlockBodyScrolling(this);

      // Restore focus to the original trigger
      // const trigger = this.originalTrigger;
      // if (typeof trigger?.focus === 'function') {
      //   setTimeout(() => trigger.focus());
      // }

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
        @cancel=${this.handleDialogCancel}
        part="base"
        id="dialog"
        class="dialog fds-modal"
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
        <article part="body" class="fds-modal__content">
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
  keyframes: [{ scale: 1 }, { scale: 1.02 }, { scale: 1 }],
  options: { duration: 250 },
});

setDefaultAnimation('dialog.overlay.show', {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  options: { duration: 250 },
});

setDefaultAnimation('dialog.overlay.hide', {
  keyframes: [{ opacity: 1 }, { opacity: 0 }],
  options: { duration: 250 },
});
