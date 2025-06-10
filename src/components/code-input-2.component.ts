import { css, html, LitElement } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin';
import '@preline/pin-input';
import { watch } from '../internal/watch';

const styles = [
  css`
    :host {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
  `,
];

@customElement('mid-code-input-2')
export class MinidCodeInput2 extends styled(LitElement, styles) {
  @queryAll('input')
  private inputElements!: NodeListOf<HTMLInputElement>;

  @property()
  value = '';

  @property({ type: Number })
  length = 5;

  connectedCallback(): void {
    super.connectedCallback();
  }

  @state()
  private values = Array<string>();

  // el.addEventListener('input', (evt) => this.onInput(evt, index));
  // el.addEventListener('paste', (evt) => this.onPaste(evt));
  // el.addEventListener('keydown', (evt) => this.onKeydown(evt, index));
  // el.addEventListener('focusin', () => this.onFocusIn(index));
  // el.addEventListener('focusout', () => this.onFocusOut(index));

  private handleFocus(index: number) {
    return () => {
      this.inputElements[index].setAttribute('placeholder', '');
    };
  }

  private handleKeydown(index: number) {
    return (event: KeyboardEvent) => {
      console.log(index, event);
      this.values[index] = (event.target as HTMLInputElement).value;
      this.value = this.values.join('');
      const input = event.target as HTMLInputElement;

      if (event.key === 'Backspace') {
        if (input.value === '' && index > 0) {
          // If current input is empty, move to previous and clear it
          this.inputElements[index - 1].focus();
          this.values[index - 1] = '';
          this.updateValueAndEmit();
        } else if (input.value !== '') {
          // If current input has a value, clear it
          input.value = '';
          this.values[index] = '';
          this.updateValueAndEmit();
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
        this.updateValueAndEmit();
      } else if (event.key.length === 1 && !/\d/.test(event.key)) {
        // Prevent non-numeric characters from being typed
        // event.preventDefault();
      }
      console.log(this.values, this.value);
      console.log(this.inputElements);

      // if (event.key === 'Backspace' && index > 0) {
      //   if ((this.items[index] as HTMLInputElement).value === '') {
      //     (this.items[index - 1] as HTMLInputElement).value = '';
      //     (this.items[index - 1] as HTMLInputElement).focus();
      //   } else {
      //     (this.items[index] as HTMLInputElement).value = '';
      //   }
      // }
      // this.setCurrentValue();
      // this.toggleCompleted();
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

      // Only allow numeric input
      if (!/^\d*$/.test(inputValue)) {
        input.value = ''; // Clear non-numeric input
        return;
      }

      this.values[index] = inputValue;
      this.updateValueAndEmit();

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
      console.log('paste', pasteData);

      if (pasteData && /^\d+$/.test(pasteData)) {
        const pasteChars = pasteData.split('');
        for (let i = 0; i < this.length; i++) {
          if (index + i < this.length && pasteChars[i]) {
            this.values[index + i] = pasteChars[i];
            // Update the actual input element's value directly as well
            if (this.inputElements[index + i]) {
              this.inputElements[index + i].value = pasteChars[i];
            }
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

  private updateValueAndEmit() {
    this.value = this.values.join('');
    this.dispatchEvent(
      new CustomEvent('mid-code-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );

    if (
      this.value.length === this.length &&
      this.values.every((digit) => digit !== '')
    ) {
      this.dispatchEvent(
        new CustomEvent('mid-code-complete', {
          detail: { value: this.value },
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

  private input(index: number) {
    return html`
      <!-- class="border-neutral rounded border" -->
      <input
        data-index=${index}
        id="mid-code-input-${index}"
        class="focus:focus-ring-sm border-neutral bg-neutral-surface block size-9 rounded-md border text-center font-mono disabled:pointer-events-none disabled:opacity-50"
        type="text"
        placeholder="○"
        min="0"
        max="9"
        size="1"
        maxlength="1"
        @keydown=${this.handleKeydown(index)}
        @input=${this.handleInput(index)}
        @paste=${this.handlePaste(index)}
        @focus=${this.handleFocus(index)}
      />
    `;
  }

  override render() {
    return html` ${this.values.map((_, index) => this.input(index))} `;
  }
}
