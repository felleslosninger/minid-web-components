import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from '../mixins/tailwind.mixin';
import {
  AsYouType,
  formatIncompletePhoneNumber,
  getCountryCallingCode,
  CountryCode,
  parsePhoneNumberCharacter,
} from 'libphonenumber-js';
import './icon/icon.component';
import {
  onChange,
  onKeyDown,
  templateFormatter,
  templateParser,
} from 'input-format';
import { watch } from '../internal/watch';
import { FormControllerMixin } from '../mixins/form-controller.mixin';

declare global {
  interface HTMLElementTagNameMap {
    'mid-phone-input': MinidPhoneInput;
  }
}

const styles = [
  css`
    :host {
      display: flex;
    }

    .country-code,
    .phone-number {
      outline: none;
      box-shadow: none;
      background-color: transparent;
    }

    .phone-number {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .country-code {
      border-right: 1px solid currentColor;
    }

    .country-button {
      border: 1px solid var(--fds-semantic-border-input-default);
      border-right: 0;
      border-top-left-radius: var(--fds-border_radius-medium);
      border-bottom-left-radius: var(--fds-border_radius-medium);
    }

    .fds-focus:focus-within,
    .fds-focus:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px #00347d;
    }
  `,
];

/**
 * @event {Event} mid-country-click - Emitted when the country button is clicked
 * @event {Event} mid-change - Emitted when the value is modified by the user
 * @event {Event} mid-input - Emitted after a new user input
 * @event {Event} mid-blur - Emitted after focus is moved away from input
 * @event {Event} mid-focus - Emitted after input gains focus
 *
 * @part base - Select the container outside the country button and phone number input
 * @part form-control - Select the container around the label and the inputs
 * @part label - Select the label element
 * @part country-button - Select the country button
 * @part input - Select the phone number input
 */
@customElement('mid-phone-input')
export class MinidPhoneInput extends FormControllerMixin(
  styled(LitElement, styles)
) {
  #formatter = new AsYouType();
  #skipCountryUpdate = false; // avoids unwanted update loop
  #currentEvent = new Event(''); // the event to be emitted after value is set
  #currentTemplate = '';

  /**
   * @ignore
   */
  @query('.phone-number')
  input!: HTMLInputElement;

  /**
   * The value of the phone number in E.164 format. Example: `"+4799999999"`
   *
   */
  @property({ reflect: true })
  value = '';

  /**
   * The phone number without the country code prefix. Example: `"99999999"`
   */
  @property({ reflect: true })
  nationalnumber = '';

  /**
   * The country code of the current phone number value. Example: `"+47"`
   */
  @property({ reflect: true })
  countrycode = '';

  /**
   * Label for the phone input.
   * Passed label will be encapsulated by a label element.
   */
  @property()
  label = '';

  /**
   * Hide label visually. Still available for screen readers
   */
  @property({ type: Boolean })
  hidelabel = false;

  /**
   * The country selected. A two letter ISO country code like: `"NO"`
   */
  @property({ reflect: true })
  country?: CountryCode;

  @state()
  hasFocus = false;

  handleCountryClick() {
    this.dispatchEvent(
      new CustomEvent('mid-country-click', { composed: true, bubbles: true })
    );
  }

  handleCountryKeyDown(event: KeyboardEvent) {
    if ([' ', 'Enter'].includes(event.key)) {
      this.dispatchEvent(
        new CustomEvent('mid-country-click', { composed: true, bubbles: true })
      );
    }
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.#formatter.input(this.value);
    this.country = this.#formatter.getCountry() ?? this.country;
    this.countrycode = this.country
      ? `+${getCountryCallingCode(this.country)}`
      : '+';

    this.value = formatIncompletePhoneNumber(this.value);
    this.value ??= this.countrycode;
    this.nationalnumber = this.removePhonePrefix(this.value);

    setTimeout(() => {
      this.input.value = `${this.countrycode}${this.nationalnumber}`;
    }, 0);
  }

  get parseTemplate() {
    return templateParser(this.#currentTemplate, parsePhoneNumberCharacter);
  }

  get formatTemplate() {
    return templateFormatter(this.#currentTemplate);
  }

  private handleBlur() {
    this.hasFocus = false;
    this.dispatchEvent(
      new Event('mid-blur', { bubbles: true, composed: true })
    );
  }

  private handleChange(event: Event) {
    // Event is dispatched after value is set
    this.#currentEvent = new Event('mid-change', {
      bubbles: true,
      composed: true,
    });

    this.setValue(event);
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Backspace' && this.input.selectionStart === 1) {
      event.preventDefault();
      return;
    }

    onKeyDown(
      event,
      this.input,
      this.parseTemplate,
      this.formatTemplate,
      this.valueChangeCallback
    );
  }

  private handleInput(event: InputEvent) {
    // Event is dispatched after value is set
    this.#currentEvent = new Event('mid-input', {
      composed: true,
      bubbles: true,
    });
    this.setValue(event);
  }

  private setValue(event: Event) {
    this.#formatter.reset();

    if (!this.input.value.startsWith('+')) {
      this.input.value = `+${this.input.value}`;
    }
    this.#formatter.input(this.input.value);
    this.#currentTemplate = this.#formatter.getTemplate();

    onChange(
      event,
      this.input,
      this.parseTemplate,
      this.formatTemplate,
      this.valueChangeCallback
    );
  }

  private valueChangeCallback = (value: string) => {
    const country =
      value.length < 2
        ? undefined
        : (this.#formatter.getCountry() ?? this.country);

    if (country !== this.country) {
      this.country = country;
      this.countrycode = this.country
        ? `+${getCountryCallingCode(this.country)}`
        : '+';
      this.#skipCountryUpdate = true;
    }

    this.value = value;
    this.nationalnumber = this.removePhonePrefix(value);
    this.dispatchEvent(this.#currentEvent);
    this.setFormValue(this.value);
  };

  private handleFocus() {
    this.hasFocus = true;
    this.dispatchEvent(
      new Event('mid-focus', { composed: true, bubbles: true })
    );
  }

  private removePhonePrefix(value: string) {
    if (this.countrycode) {
      value = value.slice(this.countrycode.length);
      if (value[0] === ' ') {
        value = value.slice(1);
      }
    }
    return value;
  }

  focus() {
    this.input.focus();
    setTimeout(() => {
      this.input.setSelectionRange(
        (this.countrycode?.length ?? 0) + 1,
        this.input.value.length
      );
    }, 0);
  }

  @watch('country', { waitUntilFirstUpdate: true })
  handleCountryChange() {
    if (this.#skipCountryUpdate) {
      this.#skipCountryUpdate = false;
      return;
    }

    this.#formatter = new AsYouType(this.country);
    this.nationalnumber = this.removePhonePrefix(this.input.value);

    this.countrycode = this.country
      ? `+${getCountryCallingCode(this.country)}`
      : '+';
    this.input.value = formatIncompletePhoneNumber(
      `${this.countrycode}${this.nationalnumber}`
    );
    this.input.dispatchEvent(new Event('input', { bubbles: true }));
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  override render() {
    const lg = false;
    const md = true;
    const sm = false;

    return html`
      <div
        part="form-control"
        class="${classMap({
          'form-control': true,
          'fds-paragraph': true,
          'fds-textfield': true,
          'flex-1': true,
          'fds-paragraph--sm': sm,
          'fds-paragraph--md': md,
          'fds-paragraph--lg': lg,
          'fds-textfield--sm': sm,
          'fds-textfield--md': md,
          'fds-textfield--lg': lg,
        })}"
      >
        ${!this.label
          ? nothing
          : html`<label
              part="label"
              for="input"
              class="${classMap({
                'sr-only': this.hidelabel,
                'fds-label': true,
                'fds-label--medium-weight': true,
                'fds-textfield__label': true,
                'fds-label--sm': sm,
                'fds-label--md': md,
                'fds-label--lg': lg,
              })}"
            >
              ${this.label}
            </label>`}
        <div part="base" class="flex">
          <button
            part="country-button"
            class="country-button fds-focus flex h-full items-center border pl-3"
            iconstyled
            variant="tertiary"
            @click=${this.handleCountryClick}
            @keydown=${this.handleCountryKeyDown}
          >
            ${this.country
              ? html`
                  <mid-icon
                    class="h-4 w-6 overflow-hidden rounded"
                    library="country"
                    name="${this.country}"
                  ></mid-icon>
                `
              : html`<div
                  class="bg-neutral-surface-active h-4 w-6 overflow-hidden rounded"
                ></div>`}
            <mid-icon name="chevron-down"></mid-icon>
          </button>

          <input
            id="input"
            class="phone-number fds-textfield__field fds-textfield__input fds-focus"
            part="phone-number"
            type="tel"
            autocomplete="tel"
            value=${this.value}
            @input=${this.handleInput}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
            @keydown=${this.handleKeydown}
            @change=${this.handleChange}
          />
        </div>
      </div>
    `;
  }
}
