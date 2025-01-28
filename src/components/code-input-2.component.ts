import { css, html, LitElement } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { styled } from 'src/mixins/tailwind.mixin';

const styles = [css``];

@customElement('mid-code-input-2')
export class MinidCodeInput2 extends styled(LitElement, styles) {
  private values = Array<string>();

  @queryAll('input')
  inputElements!: NodeList;

  @property()
  value = '';

  @property({ type: Number })
  length = 5;

  connectedCallback(): void {
    super.connectedCallback();
    this.values = new Array(this.length).fill('');
  }

  // el.addEventListener('input', (evt) => this.onInput(evt, index));
  // el.addEventListener('paste', (evt) => this.onPaste(evt));
  // el.addEventListener('keydown', (evt) => this.onKeydown(evt, index));
  // el.addEventListener('focusin', () => this.onFocusIn(index));
  // el.addEventListener('focusout', () => this.onFocusOut(index));

  handleKeydown(index: number) {
    return (event: KeyboardEvent) => {
      console.log(index, event);
      this.values[index] = (event.target as HTMLInputElement).value;
      this.value = this.values.join('');
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

  handleInput(index: number) {
    return (event: InputEvent) => {
      console.log(index, event);
    };
  }

  private input(index: number) {
    return html`
      <input
        id=${'code-input-' + index}
        class="bg-neutral-subtle"
        min="0"
        max="9"
        size="1"
        maxlength="1"
        @keydown=${this.handleKeydown(index)}
        @input=${this.handleInput(index)}
      />
    `;
  }

  override render() {
    const fields = [];
    for (let index = 0; index < this.length; index++) {
      fields.push(this.input(index));
    }
    return html` <div class="flex">${fields}</div> `;
  }
}
