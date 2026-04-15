import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin';
import { live } from 'lit/directives/live.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { debounce } from '../internal/debounce.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-search': MinidSearch;
  }
}

const styles = [
  css`
    :host {
      display: block;
    }
  `,
];

/**
 * @event mid-change - Emitted when a change to the input value is comitted by the user
 * @event mid-input - Emitted when the input element recieves input
 * @event mid-clear - Emitted when the input value is cleared
 * @event mid-focus - Emitted when input element is focused
 * @event mid-blur - Emitted when focus moves away from input element
 *
 * @csspart base - The search wrapper element
 * @csspart input - The internal `<input>` element
 * @csspart clear-button - The clear button
 */
@customElement('mid-search')
export class MinidSearch extends styled(LitElement, styles) {
  @query('input')
  input!: HTMLInputElement;

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
    this.value = this.input.value;
    this.dispatchEvent(
      new Event('mid-input', { composed: true, bubbles: true })
    );
  };

  private handleChange() {
    this.value = this.input.value;
    this.dispatchEvent(
      new Event('mid-change', { composed: true, bubbles: true })
    );
  }

  private handleFocus() {
    this.dispatchEvent(
      new Event('mid-focus', { composed: true, bubbles: true })
    );
  }

  private handleBlur() {
    this.dispatchEvent(
      new Event('mid-blur', { composed: true, bubbles: true })
    );
  }

  private handleClear(event: Event) {
    event.preventDefault();
    this.value = '';
    this.input.value = '';
    this.dispatchEvent(
      new Event('mid-clear', { composed: true, bubbles: true })
    );
    this.dispatchEvent(
      new Event('mid-input', { composed: true, bubbles: true })
    );
    this.input.focus();
  }

  focus() {
    this.input.focus();
  }

  override render() {
    return html`
    <ds-field class="ds-field">
      ${this.label
        ? html`<label class="ds-label mb-2">${this.label}</label>`
        : nothing}
      <div part="base" class="ds-search">
        <input
          part="input"
          class="ds-input"
          type="search"
          .value=${live(this.value)}
          placeholder=${ifDefined(this.placeholder || '')}
          aria-label=${ifDefined(this.label || undefined)}
          @input=${debounce(this.handleInput, this.debounce, {
            stopPropagation: true,
          })}
          @change=${this.handleChange}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
        />
        <button
          part="clear-button"
          class="ds-button"
          data-icon="true"
          data-variant="tertiary"
          type="reset"
          aria-label="Tøm"
          @click=${this.handleClear}
        ></button>
      </div>
    </ds-field>
    `;
  }
}
