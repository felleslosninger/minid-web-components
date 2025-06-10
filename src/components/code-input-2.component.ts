import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from '../mixins/tailwind.mixin';
import '@preline/pin-input';
import { watch } from '../internal/watch';
import { live } from 'lit/directives/live.js';
import { FormControlMixin } from '../mixins/form-control.mixin';
import { HasSlotController } from '../internal/slot';
import './icon/icon.component.ts';

const styles = [
  css`
    :host {
      display: block;
      gap: calc(var(--spacing) * 2);
    }
  `,
];

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
  readonly = false;

  @property({ type: Boolean })
  autofocus = false;

  @property({ type: Boolean })
  hidelabel = false;

  @state()
  private values = Array<string>();

  connectedCallback() {
    super.connectedCallback();
    this.values = Array(this.length).fill('');
    // this.updateInputValues(); // Initialize values if `value` was set before connectedCallback
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
      this.values[index] = (event.target as HTMLInputElement).value;
      this.value = this.values.join('');
      const input = event.target as HTMLInputElement;

      if (event.key === 'Backspace') {
        if (input.value === '' && index > 0) {
          // If current input is empty, move to previous and clear it
          this.inputElements[index - 1].focus();
          this.values[index - 1] = '';
          this.updateValueAndEmit(true);
        } else if (input.value !== '') {
          // If current input has a value, clear it
          input.value = '';
          this.values[index] = '';
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
        this.values[index] = '';
        this.updateValueAndEmit(true);
      }
    };
  }

  private handleInput(index: number) {
    return (event: InputEvent) => {
      const input = event.target as HTMLInputElement;
      let inputValue = input.value;
      console.log('handle input', inputValue);

      // Only allow single digit input
      if (inputValue.length > 1) {
        inputValue = inputValue.charAt(0);
        input.value = inputValue; // Correct the input value
      }

      this.values[index] = inputValue;
      this.updateValueAndEmit(true);

      // Auto-focus next input if a digit was entered and it's not the last one
      if (inputValue !== '' && index < this.length - 1) {
        this.inputElements[index + 1].focus();
      }
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
            this.values[index + i] = pasteChars[i];
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
    this.value = this.values.join('');
    this.dispatchEvent(
      new Event('mid-change', {
        bubbles: true,
        composed: true,
      })
    );

    if (
      this.value.length === this.length &&
      this.values.every((digit) => digit !== '')
    ) {
      this.dispatchEvent(
        new Event('mid-complete', {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  @watch('length')
  handleLengthChange() {
    this.values = Array(this.length).fill('');
  }

  @watch('value')
  handleValueChange() {
    if (this.#skipValueUpdate) {
      this.#skipValueUpdate = false;
      return;
    }

    const chars = this.value.split('');
    this.values.forEach((_, index) => {
      this.values[index] = chars[index];
    });
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
        ${this.readonly
          ? html`<mid-icon
              class="size-5"
              library="system"
              name="padlock-locked-fill"
            ></mid-icon>`
          : nothing}
        <slot name="label"> ${this.label} </slot>
      </label>
      <div class="text-heading-md inline-flex gap-2">
        ${this.values.map((value, index) => {
          return html`
            <input
              .value="${live(value || '')}"
              id="mid-code-input-${index}"
              class="focus:focus-ring-sm disabled:opacity-disabled placeholder:text-neutral-surface-active border-neutral bg-neutral-surface block size-9 rounded-md border text-center font-mono disabled:cursor-not-allowed"
              type="text"
              placeholder="○"
              aria-labelledby="mid-code-input-label"
              size="1"
              ?autofocus=${!index && this.autofocus}
              ?disabled=${this.disabled}
              @keydown=${this.handleKeydown(index)}
              @input=${this.handleInput(index)}
              @paste=${this.handlePaste(index)}
              @focusin=${this.handleFocus(index)}
              @blur=${this.handleBlur(index)}
            />
          `;
        })}
      </div>
    `;
  }
}
