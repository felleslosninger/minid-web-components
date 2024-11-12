import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { waitForEvent } from 'src/internal/event';
import { watch } from 'src/internal/watch';
import { styled } from 'src/mixins/tailwind.mixin';

@customElement('mid-modal')
export class MinidModal extends styled(LitElement) {
  @query('#dialog')
  dialogElement!: HTMLDialogElement;

  @property({ type: Boolean })
  open = false;

  @watch('open', { waitUntilFirstUpdate: true })
  async handleOpenChange() {
    this.dialogElement.showModal();
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
      <dialog id="dialog" class="fds-modal">
        <form method="dialog">
          <header class="fds-modal__header">
            <h2 class="fds-heading fds-heading--xs">Hei</h2>
          </header>
          <article class="fds-modal__content">
            <div>Hei sveijs</div>
          </article>
          <footer class="fds-modal__footer">
            <button type="submit" value="cancel">Cancel</button>
            <button value="confirm">Confirm</button>
          </footer>
        </form>
      </dialog>
    `;
  }
}
