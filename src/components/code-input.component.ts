import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { FormControlMixin } from '../mixins/form-control.mixin.ts';
import { styled } from '../mixins/tailwind.mixin.ts';
import { HasSlotController } from '../internal/slot.ts';
import './icon/icon.component.ts';
import { webOtpApiInit } from '../utilities/web-otp-api.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-code-input': MinidCodeInput;
  }
}

let nextUniqueId = 0;

const styles = [
  css`
      :host {
          display: block;
      }

      .input-wrapper {
          position: relative;
          cursor: text;
      }

      .character-boxes {
          display: inline-flex;
          gap: 0.5rem; /* Corresponds to gap-2 in tailwind */
      }

      .character-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
      }

      .hidden-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          background: transparent;
          border: none;
          color: transparent;
          /* Hide the real caret */
          caret-color: transparent;
          font-size: 16px; /* Must be at least 16px to prevent ios from zooming in */
          /* Allow clicks to pass through to elements underneath */
          pointer-events: none;
      }

      .hidden-input:focus {
          outline: none;
      }

      .hidden-input:disabled {
          cursor: not-allowed;
      }

      /* Fake caret using a CSS animation */
      @keyframes blink {
          0%,
          100% {
              opacity: 1;
          }
          50% {
              opacity: 0;
          }
      }

      .character-box--caret::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 60%;
          background-color: var(--color-accent-base, blue);
          animation: blink 1s step-end infinite;
      }

      /* Hide placeholder circle when the caret is present */
      .character-box--caret.character-box--empty {
          color: transparent;
      }

      /* Hide increment/decrement buttons on inputs */
      input[type='number']::-webkit-outer-spin-button,
      input[type='number']::-webkit-inner-spin-button,
      input[type='number'] {
          -webkit-appearance: none;
          margin: 0;
          -moz-appearance: textfield !important;
      }
  `,
];

/**
 *
 * @event mid-change - Emitted when a change to the input value is comitted by the user
 * @event mid-input - Emitted when the input element recieves input
 * @event mid-complete - Emitted when all characters have been entered.
 * @event {detail: { validity: ValidityState }} mid-invalid-hide - Emitted when the error message should be hidden
 * @event {detail: { validity: ValidityState }} mid-invalid-show - Emitted when the error message should be shown
 *
 * @slot label - The input's label if you need to use HTML. Alternatively, you can use the `label` attribute.
 *
 * @csspart input-container - The wrapper around the input elements. This can be used to adjust font-size.
 * @csspart character-boxes - The container for the visual character boxes.
 * @csspart character-box - An individual character box.
 *
 * @method focus - Focuses the input element
 * @method clear - Clears the input
 */
@customElement('mid-code-input')
export class MinidCodeInput extends FormControlMixin(
  styled(LitElement, styles)
) {
  private readonly hasSlotControler = new HasSlotController(this, 'label');
  private readonly labelId = `mid-code-input-label-${nextUniqueId++}`;

  @query('.hidden-input')
  private inputElement!: HTMLInputElement;

  @property({ reflect: true })
  value = '';

  @property()
  label = '';

  /**
   * Change what characters are allowed to be used in the code field.
   */
  @property()
  allowedtype: 'digits' | 'alphanumeric' | 'any' = 'digits';

  /**
   * For displaying appropriate virtual keyboard
   */
  @property()
  inputmode: 'numeric' | 'text' = 'numeric';

  /**
   * Adjusts the font-size of the code inputs
   */
  @property()
  size: 'sm' | 'md' | 'lg' = 'sm';

  /**
   * Number of input characters or digits
   */
  @property({ type: Number })
  length = 5;

  @property({ type: Boolean })
  disabled = false;

  /**
   * Focuses the first input element on page load
   */
  @property({ type: Boolean })
  autofocus = false;

  /**
   *  The minimum length of input that will be considered valid.
   */
  @property({ type: Number })
  minlength?: number;

  /**
   * Error message to display when the input is invalid, also activates invalid styling
   */
  @property()
  invalidmessage = '';

  /**
   * Visually hides `label` (still available for screen readers)
   */
  @property({ type: Boolean })
  hidelabel = false;

  /**
   * Makes the input required
   */
  @property({ type: Boolean })
  required = false;

  /**
   * A regular expression pattern to validate input against.
   */
  @property()
  pattern?: string;

  @state()
  private isFocused = false;

  @state()
  private _isComposing = false;


  get validationTarget() {
    return this.inputElement;
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    webOtpApiInit(this.renderRoot);
  }

  private handleBoxClick(index: number) {
    if (this.disabled) {
      return;
    }

    // Truncate the value to the clicked position
    this.value = this.value.substring(0, index);

    // Focus the input to move the caret
    this.focus();
  }

  private handleFocus() {
    this.isFocused = true;
  }

  private handleBlur() {
    this.isFocused = false;
  }

  private filterToChar(s: string) {
   switch (this.allowedtype) {
     case 'digits':
       return s.replace(/\D/g, '');
     case 'alphanumeric':
       return s.replace(/[^A-Za-z0-9]/g, '');
     default:
       return s;
   }
 }

 private _syncFromDom() {
   const input = this.inputElement;
   const raw = input.value || '';
   const cleaned = this.filterToChar(raw);
   const value = cleaned.slice(0, this.length);


   if (input.value !== value) input.value = value;

   if(this.value !== value){
     this.value = value;
     this.setValue(value);


   this.inputElement.dispatchEvent(new Event('mid-input', { bubbles: true, composed: true }));

   if (this.value.length === this.length && this.value.length > 0) {
     this.inputElement.dispatchEvent(new Event('mid-complete', { bubbles: true, composed: true }));
   }}
 }


  private handleBeforeInput(e: InputEvent) {
    if(e.inputType.startsWith('insertComposition')) return;
    if(e.inputType.startsWith('insertFrom')) return;
    if (e.inputType === 'insertText' && e.data && this.filterToChar(e.data) === '') {
      e.preventDefault();
    }
  }

  private handleInput(_e: InputEvent) {
    if (this._isComposing) return;
    this._syncFromDom();
  }

  private handleCompositionStart() {
    this._isComposing = true;
  }

  private handleCompositionEnd() {
    this._isComposing = false;
    this._syncFromDom();
  }

  private handleChange() {
    this.inputElement.dispatchEvent(
      new Event('mid-change', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleKeydown(event: KeyboardEvent) {
    const hasModifier =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    if (event.key === 'Enter' && !hasModifier) {
      // Pressing enter when focused on an input should submit the form like a native input, but we wait a tick before
      // submitting to allow users to cancel the keydown event if they need to
      setTimeout(() => {
        // When using an Input Method Editor (IME), pressing enter will cause the form to submit unexpectedly. One way
        // to check for this is to look at event.isComposing, which will be true when the IME is open.
        if (!event.defaultPrevented && !event.isComposing) {
          this.form?.requestSubmit();
        }
      });
    }
  }

  clear() {
    this.value = '';
    this.setValue('');
  }

  resetFormControl() {
    this.clear();
  }


  focus(options?: FocusOptions): void {
    this.inputElement?.focus(options);
  }


  override render() {
    const hasLabelSlot = this.hasSlotControler.test('label');
    const hasLabel = !!this.label || !!hasLabelSlot;

    const chars = this.value.split('');
    const displayValues = Array.from(
      { length: this.length },
      (_, i) => chars[i] || '',
    );
    const caretIndex = this.disabled ? -1 : this.value.length;

    const derivedPattern =
      this.pattern ??
      (this.allowedtype === 'digits'
        ? '^[0-9]*$'
        : this.allowedtype === 'alphanumeric'
          ? '^[A-Za-z0-9]*$'
          : undefined);



    return html`
      <label
        id="${this.labelId}"
        class="${classMap({
      'sr-only': this.hidelabel || !hasLabel,
      'opacity-disabled': this.disabled,
    })} mb-2 block items-center gap-1 font-medium"
      >
        <slot name="label"> ${this.label} </slot>
      </label>
      <div
        part="input-container"
        class="input-wrapper ${classMap({
      'text-heading-sm': this.size === 'sm',
      'text-heading-md': this.size === 'md',
      'text-heading-lg': this.size === 'lg',
      'opacity-disabled': this.disabled,
    })}"
        @click=${() => this.focus()}
      >
        <div part="character-boxes" class="character-boxes">
          ${displayValues.map((char, index) => {
      const hasCaret = this.isFocused && index === caretIndex;
      return html`
              <div
                part="character-box"
                class="character-box ${classMap({
        'border': !this.invalidmessage,
        'border-2': this.invalidmessage,
        'border-neutral': !this.invalidmessage,
        'border-danger': this.invalidmessage,
        'bg-neutral': !this.invalidmessage,
        'bg-danger-tinted': this.invalidmessage,
        'text-neutral-surface-active':
          !char && !this.invalidmessage,
        'text-danger-surface-active': !char && this.invalidmessage,
        'character-box--caret': hasCaret,
        'character-box--empty': !char,
        'focus-ring-sm': hasCaret,
      })} size-9 rounded-md text-center font-mono"
                @click=${(e: MouseEvent) => {
        e.stopPropagation();
        this.handleBoxClick(index);
      }}
              >
                ${char || '○'}
              </div>
            `;
    })}
        </div>
        <input
          class="hidden-input"
          .value="${live(this.value)}"
          id="mid-code-input-hidden"
          type="text"
          aria-labelledby="${this.labelId}"
          maxlength="${this.length}"
          ?autofocus="${this.autofocus}"
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          .pattern="${derivedPattern}"
          inputmode="${this.inputmode}"
          allowedtype="${this.allowedtype}"
          autocomplete="one-time-code"
          @input="${this.handleInput}"
          @compositionstart=${this.handleCompositionStart}
          @compositionend=${this.handleCompositionEnd}
          @beforeinput="${this.handleBeforeInput}"
          @change="${this.handleChange}"
          @keydown="${this.handleKeydown}"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}"
        />
      </div>
      <div
        class="text-danger-subtle mt-2 flex gap-1"
        aria-live="polite"
        ?hidden=${!this.invalidmessage}
      >
        <mid-icon
          name="xmark-octagon-fill"
          class="mt-1 min-h-5 min-w-5"
        ></mid-icon>
        ${this.invalidmessage}
      </div>
    `;
  }
}
