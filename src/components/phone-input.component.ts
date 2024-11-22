import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { styled } from 'src/mixins/tailwind.mixin';
import parsePhoneNumber, {
  AsYouType,
  parseIncompletePhoneNumber,
  formatIncompletePhoneNumber,
  getCountryCallingCode,
  CountryCode,
} from 'libphonenumber-js';
import './icon/icon.component';

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
  private asYouType = new AsYouType();
  @query('.country-code')
  countryCodeInput!: HTMLInputElement;

  @query('.phone-number')
  phoneNumberInput!: HTMLInputElement;

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
  country?: string;

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
  initialValue = '';

  handleCountryClick() {
    this.dispatchEvent(
      new Event('mid-country-click', { composed: true, bubbles: true })
    );
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.value) {
      this.initialValue = this.value;
      // this.asYouType.input(this.value);
    }
    this.setValue(this.value);

    if (this.defaultcountry) {
      this.country = this.defaultcountry;
    }
  }

  private handleBlur() {
    this.hasFocus = false;
    this.dispatchEvent(
      new Event('mid-blur', { bubbles: true, composed: true })
    );
  }

  private handleChange() {
    // this.value = this.phoneNumberInput.value;
    this.dispatchEvent(
      new Event('mid-change', { bubbles: true, composed: true })
    );
  }

  private handleInput(event: InputEvent) {
    // this.countrycode = this.countryCodeInput.value;
    this.setValue(this.phoneNumberInput.value);
    this.asYouType.getTemplate();
    this.dispatchEvent(
      new CustomEvent('mid-input', {
        bubbles: true,
        composed: true,
        detail: {
          countryCode: this.countrycode,
          phoneNumber: this.phonenumber,
        },
      })
    );
  }

  private handleFocus() {
    this.hasFocus = true;
    this.dispatchEvent(
      new Event('mid-focus', { composed: true, bubbles: true })
    );
  }

  private setValue(value: string) {
    // this.countrycode = this.countryCodeInput.value;

    console.log(value);

    if (!value) {
      console.log('📭', !value);

      if (this.defaultcountry) {
        this.countrycode = getCountryCallingCode(this.defaultcountry);
        value = `+${this.countrycode} `;
      }
    }

    const parsed = parsePhoneNumber(value);
    const incomplete = parseIncompletePhoneNumber(value);
    const incompleteFormatted = formatIncompletePhoneNumber(value);
    // const parsed = this.asYouType.getNumber()?.number;

    // const formatted = this.asYouType.getNumber()?.formatInternational();
    // const countryCode = this.asYouType.getCallingCode();

    this.countrycode = parsed?.countryCallingCode;
    this.country = parsed?.country ?? this.defaultcountry;
    this.value = incompleteFormatted;

    console.log(value, parsed, incomplete);
    console.log(incompleteFormatted);

    // console.log(formatted, this.initialValue, countryCode);
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
          <span class="prefix">
            <slot name="prefix"></slot>
          </span>
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
          <!-- <input
            part="country-code"
            class="country-code"
            placeholder="+47"
            size="5"
            maxlength="5"
            aria-describedby="description"
            .value=${live(this.countrycode)}
            @input=${this.handleInput}
            @change=${this.handleChange}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
          /> -->

          <input
            class="phone-number fds-textfield__field fds-textfield__input fds-focus"
            part="phone-number"
            .value=${live(this.value)}
            @input=${this.handleInput}
            @change=${this.handleChange}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
          />
        </div>
      </div>
    `;
  }
}
