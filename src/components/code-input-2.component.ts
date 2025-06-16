import { css, html, LitElement } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from '../mixins/tailwind.mixin';
import '@preline/pin-input';
import { watch } from '../internal/watch';
import { live } from 'lit/directives/live.js';
import { FormControlMixin } from '../mixins/form-control.mixin';
import { HasSlotController } from '../internal/slot';
import './icon/icon.component.ts';
import {
  maxLengthValidator,
  minLengthValidator,
  patternValidator,
  requiredValidator,
} from 'src/mixins/validators.ts';

const styles = [
  css`
    :host {
      display: block;
    }
  `,
];

/**
 *
 * @event mid-change - Emitted when a change to the input value is comitted by the user
 * @event mid-input - Emitted when the input element recieves input
 * @event mid-clear - Emitted when the input value is cleared
 * @event mid-focus - Emitted when input element is focused
 * @event mid-blur - Emitted when focus moves away from input element
 * @event {detail: { validity: ValidityState }} mid-invalid-hide - Emitted when the error message should be hidden
 * @event {detail: { validity: ValidityState }} mid-invalid-show - Emitted when the error message should be shown
 *
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 */
@customElement('mid-code-input-2')
export class MinidCodeInput2 extends FormControlMixin(
  styled(LitElement, styles)
) {
  private readonly hasSlotControler = new HasSlotController(this, 'label');
  #skipValueUpdate = false;

  @queryAll('input')
  private inputElements!: NodeListOf<HTMLInputElement>;

  @property()
  value = '';

  @property()
  label = '';

  /**
   * Number of input characters or digits
   */
  @property({ type: Number })
  length = 5;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  autofocus = false;

  /**
   *  The minimum length of input that will be considered valid.
   */
  @property({ type: Number })
  minlength?: number;

  /**
   *  The maximum length of input that will be considered valid.
   */
  @property({ type: Number })
  maxlength?: number;

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
   *
   */
  @property()
  inputmode = 'numeric';

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

  private handleFocus(index: number) {
    return () => {
      this.inputElements[index].setAttribute('placeholder', '');
      this.inputElements[index].setSelectionRange(0, 0);
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
            this.form.requestSubmit();
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
    this.#skipValueUpdate = skipValueUpdate;
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

  private updateInternalValues(value: string) {
    const chars = value.split('');
    this.internalValues.forEach((_, index) => {
      this.internalValues[index] = chars[index];
    });
  }

  @watch('length')
  handleLengthChange() {
    this.internalValues = Array(this.length).fill('');
    this.updateInternalValues(this.value);
  }

  @watch('value')
  handleValueChange() {
    this.setValue(this.value);
    console.log(this.value, this.validity);

    if (this.#skipValueUpdate) {
      this.#skipValueUpdate = false;
      return;
    }

    this.updateInternalValues(this.value);
  }

  override render() {
    const hasLabelSlot = this.hasSlotControler.test('label');
    const hasLabel = !!this.label || !!hasLabelSlot;
    return html`
      <label
        id="mid-code-input-label"
        class="${classMap({
          'sr-only': this.hidelabel || !hasLabel,
        })} mb-2 block items-center gap-1 font-medium"
      >
        <slot name="label"> ${this.label} </slot>
      </label>
      <div class="text-heading-md inline-flex gap-2">
        ${this.internalValues.map((value, index) => {
          return html`
            <input
              .value="${live(value || '')}"
              id="mid-code-input-${index}"
              class="${classMap({
                border: !this.invalidmessage,
                'border-neutral': !this.invalidmessage,
                'bg-neutral': !this.invalidmessage,
                'placeholder:text-neutral-surface-active': !this.invalidmessage,
                'border-2': this.invalidmessage,
                'border-danger': this.invalidmessage,
                'bg-danger-tinted': this.invalidmessage,
                'placeholder:text-danger-surface-active': this.invalidmessage,
              })} focus:focus-ring-sm disabled:opacity-disabled size-9 rounded-md text-center font-mono disabled:cursor-not-allowed"
              type="text"
              placeholder="○"
              aria-labelledby="mid-code-input-label"
              size="1"
              ?autofocus=${!index && this.autofocus}
              ?disabled=${this.disabled}
              inputmode=${this.inputmode}
              @keydown=${this.handleKeydown(index)}
              @input=${this.handleInput(index)}
              @paste=${this.handlePaste(index)}
              @focusin=${this.handleFocus(index)}
              @blur=${this.handleBlur(index)}
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
