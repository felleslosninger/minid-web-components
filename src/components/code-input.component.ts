import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { watch } from '../internal/watch.ts';
import { FormControlMixin } from '../mixins/form-control.mixin.ts';
import { styled } from '../mixins/tailwind.mixin.ts';
import { HasSlotController } from '../internal/slot.ts';
import './icon/icon.component.ts';
import {
  maxLengthValidator,
  minLengthValidator,
  patternValidator,
  requiredValidator,
} from '../mixins/validators.ts';
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
 * @event {detail: { validity: ValidityState }} mid-invalid-hide - Emitted when the error message should be hidden
 * @event {detail: { validity: ValidityState }} mid-invalid-show - Emitted when the error message should be shown
 *
 * @slot label - The input's label if you need to use HTML. Alternatively, you can use the `label` attribute.
 *
 * @csspart input-container - The wrapper around the input elements. This can be used to adjust font-size.
 *
 */
@customElement('mid-code-input')
export class MinidCodeInput extends FormControlMixin(
  styled(LitElement, styles)
) {
  private readonly hasSlotControler = new HasSlotController(this, 'label');
  #skipValueVisualUpdate = false;
  private readonly labelId = `mid-code-input-label-${nextUniqueId++}`;

  @queryAll('input')
  private inputElements!: NodeListOf<HTMLInputElement>;

  @property({ reflect: true })
  value = '';

  @property()
  label = '';

  @property()
  type: 'number' | 'text' = 'text';

  /**
   * For displaying appropriate virtual keyboard
   */
  @property()
  inputmode: 'numeric' | 'text' = 'text';

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
  private internalValues = Array<string>(this.length).fill('');

  static get formControlValidators() {
    return [
      requiredValidator,
      maxLengthValidator,
      minLengthValidator,
      patternValidator,
    ];
  }

  get validationTarget() {
    return this.inputElements?.length ? this.inputElements[0] : null;
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    webOtpApiInit(this.renderRoot);
  }

  private handleFocus(index: number) {
    return () => {
      this.inputElements[index].setAttribute('placeholder', '');
      this.inputElements[index].select();
    };
  }

  private handleBlur(index: number) {
    return () => {
      this.inputElements[index].setAttribute('placeholder', '○');
    };
  }

  private handleKeydown(index: number) {
    return (event: KeyboardEvent) => {
      this.internalValues[index] = (event.target as HTMLInputElement).value;
      this.value = this.internalValues.join('');
      const input = event.target as HTMLInputElement;
      const hasModifier =
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

      if (event.key === 'Backspace') {
        if (input.value === '' && index > 0) {
          // If current input is empty, move to previous and clear it
          this.inputElements[index - 1].focus();
          this.internalValues[index - 1] = '';
          this.updateValueAndEmit(true);
        } else if (input.value !== '') {
          // If current input has a value, clear it
          input.value = '';
          this.internalValues[index] = '';
          this.updateValueAndEmit(true);
        }
      } else if (event.key === 'ArrowLeft') {
        if (index > 0) {
          this.inputElements[index - 1].focus();
        }
      } else if (event.key === 'ArrowRight') {
        if (index < this.length - 1) {
          this.inputElements[index + 1].focus();
        }
      } else if (event.key === 'Delete') {
        // Clear current field without moving
        input.value = '';
        this.internalValues[index] = '';
        this.updateValueAndEmit(true);
      } else if (event.key === 'Enter' && !hasModifier) {
        // Pressing enter when focused on an input should submit the form like a native input, but we wait a tick before
        // submitting to allow users to cancel the keydown event if they need to
        setTimeout(() => {
          //
          // When using an Input Method Editor (IME), pressing enter will cause the form to submit unexpectedly. One way
          // to check for this is to look at event.isComposing, which will be true when the IME is open.
          if (!event.defaultPrevented && !event.isComposing) {
            this.form?.requestSubmit();
          }
        });
      }
    };
  }

  private handleInput(index: number) {
    return (event: InputEvent) => {
      const input = event.target as HTMLInputElement;
      let inputValue = input.value;

      // Only allow single digit input
      if (inputValue.length > 1) {
        inputValue = inputValue.charAt(0);
        input.value = inputValue; // Correct the input value
      }

      this.internalValues[index] = inputValue;
      this.updateValueAndEmit(true);

      // Auto-focus next input if a digit was entered and it's not the last one
      if (inputValue !== '' && index < this.length - 1) {
        this.inputElements[index + 1].focus();
      }

      this.dispatchEvent(
        new Event('mid-input', { bubbles: true, composed: true })
      );
    };
  }

  private handlePaste(index: number) {
    return (event: ClipboardEvent) => {
      event.preventDefault(); // Prevent default paste behavior
      const pasteData = event.clipboardData?.getData('text').trim();

      if (pasteData) {
        const pasteChars = pasteData.split('');
        for (let i = 0; i < this.length; i++) {
          if (index + i < this.length && pasteChars[i]) {
            this.internalValues[index + i] = pasteChars[i];
            // Update the actual input element's value directly as well
            // if (this.inputElements[index + i]) {
            //   this.inputElements[index + i].value = pasteChars[i];
            // }
          }
        }
        this.updateValueAndEmit();

        // Focus the last filled input or the last input if all are filled
        const lastFilledIndex = Math.min(
          index + pasteChars.length - 1,
          this.length - 1
        );
        this.inputElements[lastFilledIndex]?.focus();
      }
    };
  }

  private updateValueAndEmit(skipValueUpdate = false) {
    this.#skipValueVisualUpdate = skipValueUpdate;
    this.value = this.internalValues.join('');
    this.dispatchEvent(
      new Event('mid-change', {
        bubbles: true,
        composed: true,
      })
    );

    if (
      this.value.length === this.length &&
      this.internalValues.every((digit) => digit !== '')
    ) {
      this.dispatchEvent(
        new Event('mid-complete', {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private valueVisualUpdate(value: string) {
    const chars = value.split('');
    this.internalValues.forEach((_, index) => {
      this.internalValues[index] = chars[index];
    });
  }

  @watch('length')
  handleLengthChange() {
    this.internalValues = Array(this.length).fill('');
    this.valueVisualUpdate(this.value);
  }

  @watch('value')
  handleValueChange() {
    this.setValue(this.value);

    if (this.#skipValueVisualUpdate) {
      this.#skipValueVisualUpdate = false;
      return;
    }

    this.valueVisualUpdate(this.value);
  }

  override render() {
    const hasLabelSlot = this.hasSlotControler.test('label');
    const hasLabel = !!this.label || !!hasLabelSlot;
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
        class="${classMap({
          'text-heading-sm': this.size === 'sm',
          'text-heading-md': this.size === 'md',
          'text-heading-lg': this.size === 'lg',
        })} inline-flex gap-2"
      >
        ${this.internalValues.map((value, index) => {
          return html`
            <input
              .value="${live(value || '')}"
              id="mid-code-input-${index}"
              class="${classMap({
                border: !this.invalidmessage,
                'border-2': this.invalidmessage,
                'border-neutral': !this.invalidmessage,
                'border-danger': this.invalidmessage,
                'bg-neutral': !this.invalidmessage,
                'bg-danger-tinted': this.invalidmessage,
                'placeholder:text-neutral-surface-active': !this.invalidmessage,
                'placeholder:text-danger-surface-active': this.invalidmessage,
              })} focus:focus-ring-sm disabled:opacity-disabled size-9 rounded-md text-center font-mono disabled:cursor-not-allowed"
              type="${this.type}"
              placeholder="○"
              aria-labelledby="${this.labelId}"
              size="1"
              ?autofocus="${!index && this.autofocus}"
              ?disabled="${this.disabled}"
              inputmode="${this.inputmode}"
              @keydown="${this.handleKeydown(index)}"
              @input="${this.handleInput(index)}"
              @paste="${this.handlePaste(index)}"
              @focus="${this.handleFocus(index)}"
              @blur="${this.handleBlur(index)}"
            />
          `;
        })}
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
