import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { classMap } from 'lit/directives/class-map.js';
import { watch } from '../internal/watch';
import { styled } from '../mixins/tailwind.mixin';
import { FormControlMixin } from '../mixins/form-control.mixin';
import './icon/icon.component.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-radio': MinidRadio;
  }
}

const styles = [
  css`
    :host {
      display: inline-flex;
      cursor: pointer;
    }
    :host:has(input:disabled) {
      cursor: not-allowed;
    }
  `,
];

/**
 *
 * @slot -- The radio's label
 *
 * @event mid-blur - Emitted when the control loses focus.
 * @event mid-focus - Emitted when the control gains focus.
 *
 * @csspart radio - Select the radio input element
 * @csspart label - Select the label element
 */
@customElement('mid-radio')
export class MinidRadio extends FormControlMixin(styled(LitElement, styles)) {
  @query('input[type="radio"]')
  input!: HTMLInputElement;

  /**
   * The name of the radio, used to bind together multiple radios.
   */
  @property()
  name = 'option';

  /**
   *  The radio button's checked state.
   */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /**
   * The radio's value. When selected, the radio group will receive this value.
   */
  @property()
  value = '';

  /**
   * Disables the radio button.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean })
  invalid = false;

  shouldFormValueUpdate(): boolean {
    return this.checked;
  }

  get validationTarget() {
    return this.input;
  }

  constructor() {
    super();
    this.addEventListener('blur', this.handleBlur);
    this.addEventListener('click', this.handleClick);
    this.addEventListener('focus', this.handleFocus);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'presentation');
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');

    this.classList.add('rounded');
  }

  private handleKeydown(event: KeyboardEvent) {
    const hasModifier =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    // Pressing enter when focused on an input should submit the form like a native input, but we wait a tick before
    // submitting to allow users to cancel the keydown event if they need to
    if (event.key === 'Enter' && !hasModifier) {
      setTimeout(() => {
        //
        // When using an Input Method Editor (IME), pressing enter will cause the form to submit unexpectedly. One way
        // to check for this is to look at event.isComposing, which will be true when the IME is open.
        if (!event.defaultPrevented && !event.isComposing) {
          this.form.requestSubmit();
        }
      });
    }
  }

  private handleBlur() {
    this.classList.remove('shadow-focus-visible');
    this.dispatchEvent(
      new Event('mid-blur', { composed: true, bubbles: true })
    );
  }

  private handleFocus() {
    if (this.disabled) {
      return;
    }

    this.focus();
    this.dispatchEvent(
      new Event('mid-focus', { composed: true, bubbles: true })
    );
  }

  private handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.checked = true;
    this.dispatchEvent(new Event('mid-change'));
  }

  @watch('disabled', { waitUntilFirstUpdate: true })
  handleDisabledChange() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  @watch('checked', { waitUntilFirstUpdate: true })
  handleCheckChange() {
    this.input.checked = this.checked;
  }

  /**
   * Sets focus on the radio button.
   */
  focus(options?: FocusOptions) {
    this.input.focus(options);
  }

  override render() {
    return html`
      <label
        part="label"
        class="has-disabled:opacity-disabled grid cursor-pointer grid-cols-[auto_1fr] gap-2 has-disabled:cursor-not-allowed"
      >
        <input
          type="radio"
          part="radio"
          name="${this.name}"
          class="${classMap({
            'bg-neutral': !this.invalid,
            'border-neutral': !this.invalid,
            'bg-danger-tinted': this.invalid,
            'border-danger-base': this.invalid,
          })} checked:bg-accent-base checked:before:bg-neutral focus-visible:focus-ring-sm checked:border-accent-base my-0.5 grid size-6 cursor-pointer appearance-none place-content-center rounded-full border-2 p-0.5 shadow-none before:size-2.5 before:scale-0 before:rounded-full before:transition-transform before:duration-100 checked:before:scale-100 disabled:cursor-not-allowed"
          ?checked=${live(this.checked)}
          ?disabled=${this.disabled}
          @keydown=${this.handleKeydown}
        />
        <slot></slot>
      </label>
    `;
  }
}
