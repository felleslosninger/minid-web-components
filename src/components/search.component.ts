import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styled } from 'src/mixins/tailwind.mixin';
import './textfield.component';
import './icon/icon.component';
import './button.component';
import { live } from 'lit/directives/live.js';
import { MinidTextfield } from './textfield.component.ts';
import { debounce } from 'src/internal/debounce.ts';

/**
 * @event mid-change - Emitted when a change to the input value is comitted by the user
 * @event mid-input - Emitted when the input element recieves input
 * @event mid-clear - Emitted when the input value is cleared
 * @event mid-focus - Emitted when input element is focused
 * @event mid-blur - Emitted when focus moves away from input element
 */
@customElement('mid-search')
export class MinidSearch extends styled(LitElement) {
  @query('mid-textfield')
  textField!: MinidTextfield;

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  @property()
  label = '';

  @property()
  placeholder = '';

  @property()
  value = '';

  /**
   * Debounce the `mid-input` event by a number of milliseconds
   */
  @property({ type: Number, reflect: true })
  debounce = 0;

  private handleInput = () => {
    this.value = this.textField.value;
    this.dispatchEvent(
      new Event('mid-input', { composed: true, bubbles: true })
    );
  };

  override render() {
    return html`
      <mid-textfield
        .value=${live(this.value)}
        type="search"
        size=${this.size}
        label=${this.label}
        placeholder=${this.placeholder}
        @mid-input=${debounce(this.handleInput, this.debounce, {
          stopPropagation: true,
        })}
        clearable
      >
        <mid-icon
          slot="prefix"
          class="text-2xl"
          library="system"
          name="magnifying-glass"
        >
        </mid-icon>
      </mid-textfield>
    `;
  }
}
