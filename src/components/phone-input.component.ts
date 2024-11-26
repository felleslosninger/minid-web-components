import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from 'src/mixins/tailwind.mixin';
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
import { watch } from 'src/internal/watch';

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
      /* padding: 0 1rem; */
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

    .fds-focus:focus-within {
      --fds-focus-border-width: 3px;
      outline: var(--fds-focus-border-width) solid
        var(--fds-semantic-border-focus-outline);
      outline-offset: var(--fds-focus-border-width);
      box-shadow: 0 0 0 var(--fds-focus-border-width)
        var(--fds-semantic-border-focus-boxshadow);
    }
  `,
];

@customElement('mid-phone-input')
export class MinidPhoneInput extends styled(LitElement, styles) {
  #formatter = new AsYouType();
  #skipCountryUpdate = false;
  #currentEvent = new Event('');
  #currentTemplate = '';

  @query('.phone-number')
  input!: HTMLInputElement;

  /**
   *
   */
  @property()
  value = '';

  @property({ reflect: true })
  countrycode? = '';

  @property({ reflect: true })
  phonenumber = '';

  @property()
  label = '';

  /**
   * The country selected
   */
  @property()
  country?: CountryCode;

  /**
   * If defaultCountry is specified then the phone number can
   * be input both in "international" format and "national" format.
   * A phone number that's being input in "national" format will be
   * parsed as a phone number belonging to the defaultCountry. Must be
   * a supported country code. Example: defaultCountry="NO"
   */
  @property()
  defaultcountry?: CountryCode;

  @state()
  hasFocus = false;

  @state()
  phonePrefix?: string;

  handleCountryClick() {
    this.dispatchEvent(
      new CustomEvent('mid-country-click', { composed: true, bubbles: true })
    );
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (this.defaultcountry) {
      this.country = this.defaultcountry;
    }

    this.#formatter.input(this.value);
    this.country = this.#formatter.getCountry() ?? this.country;
    this.phonePrefix = this.country
      ? `+${getCountryCallingCode(this.country)}`
      : '+';

    this.value = formatIncompletePhoneNumber(this.value);
    this.value ??= this.phonePrefix;

    setTimeout(() => {
      this.input.value = `${this.phonePrefix}${this.removePhonePrefix(this.value)}`;
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

  private valueChangeCallback = (value: string) => {
    const country =
      value.length < 2
        ? undefined
        : (this.#formatter.getCountry() ?? this.country);

    if (country !== this.country) {
      this.country = country;
      this.#skipCountryUpdate = true;
    }

    this.value = value;
    this.dispatchEvent(this.#currentEvent);
  };

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

  private handleFocus() {
    this.hasFocus = true;
    this.dispatchEvent(
      new Event('mid-focus', { composed: true, bubbles: true })
    );
  }

  private removePhonePrefix(value: string) {
    console.log(this.phonePrefix);
    if (this.phonePrefix) {
      value = value.slice(this.phonePrefix.length);
      if (value[0] === ' ') {
        value = value.slice(1);
      }
    }
    return value;
  }

  @watch('country', { waitUntilFirstUpdate: true })
  handleCountryChange() {
    if (this.#skipCountryUpdate) {
      console.log('skipping', this.#skipCountryUpdate);
      this.#skipCountryUpdate = false;
      return;
    }

    this.#formatter = new AsYouType(this.country ?? this.defaultcountry);
    const nationalNumber = this.removePhonePrefix(this.input.value);
    console.log(this.phonePrefix, nationalNumber);

    this.phonePrefix = this.country
      ? `+${getCountryCallingCode(this.country)}`
      : '+';
    console.log(this.phonePrefix);
    this.input.value = formatIncompletePhoneNumber(
      `${this.phonePrefix}${nationalNumber}`
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
          //   'fds-textfield--readonly': this.readonly,
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
              for="input"
              class="${classMap({
                // 'sr-only': this.hidelabel,
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
        <div
          part="base"
          class="${classMap({
            field: true,

            // 'fds-textfield__field': true,
            // 'fds-textfield__input': true,
            // 'fds-focus': this.hasFocus,
          })} flex"
        >
          <button
            class="country-button fds-focus flex h-full items-center border border-text-action-active pl-3"
            iconstyled
            variant="tertiary"
            @click=${this.handleCountryClick}
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
                  class="h-4 w-6 overflow-hidden rounded bg-surface-neutral-active"
                ></div>`}
            <mid-icon name="chevron-down"></mid-icon>
          </button>

          <input
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
