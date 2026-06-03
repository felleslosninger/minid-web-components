import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styled } from '../mixins/tailwind.mixin';
import {
  AsYouType,
  formatIncompletePhoneNumber,
  getCountryCallingCode,
  type CountryCode,
  parsePhoneNumberFromString,
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
import { HasSlotController } from '../internal/slot';
import { FormControlMixin } from '../mixins/form-control.mixin';
import { requiredValidator } from '../mixins/validators';
import { LangController } from '../controllers/lang.controller.js';
import { getLang } from '../utilities/lang';
import { getTranslations } from '../utilities/translations';

declare global {
  interface HTMLElementTagNameMap {
    'mid-phone-input': MinidPhoneInput;
  }
}

type PhoneAutocomplete = 'tel' | 'tel-national';

const styles = [
  css`
    :host {
      display: block;
    }
  `,
];

let nextUniqueId = 0;

/**
 * @event {Event} mid-country-click - Emitted when the country button is clicked
 * @event {Event} mid-change - Emitted when the value is modified by the user
 * @event {Event} mid-input - Emitted after a new user input
 * @event {Event} mid-blur - Emitted after focus is moved away from input
 * @event {Event} mid-focus - Emitted after input gains focus
 *
 * @part base - Select the container outside the country button and phone number input
 * @part field - Select the container around the label and the inputs
 * @part label - Select the label element
 * @part country-button - Select the country button
 * @part input - Select the phone number input
 */
@customElement('mid-phone-input')
export class MinidPhoneInput extends FormControlMixin(
  styled(LitElement, styles)
) {
  private readonly inputId: string;
  private readonly validationId: string;
  private readonly labelId = `mid-code-input-label-${nextUniqueId++}`;
  private formatter = new AsYouType();
  private skipCountryUpdate = false; // avoids unwanted update loop
  private currentEvent = new Event(''); // the event to be emitted after value is set
  private currentTemplate = '';
  private hasSlotControler = new HasSlotController(this, 'label');

  @query('input')
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

  /**
   * Controls the native browser autofill token used for the phone number input.
   *
   * `tel` expects a full phone number, including country code when available.
   * If a value without a country code matches the selected country, the country
   * prefix is added.
   * `tel-national` expects the national number and prefixes the selected country.
   */
  @property()
  autocomplete: PhoneAutocomplete = 'tel';

  /**
   * Activates invalid styling
   */
  @property({ type: Boolean })
  invalid = false;

  /**
   * Error message to display when the input is invalid, also activates invalid styling
   */
  @property()
  invalidmessage = '';

  /**
   * Makes the input required
   */
  @property({ type: Boolean })
  required = false;

  /**
   * Makes the input read-only, meaning the user cannot change the value.
   */
  @property({ type: Boolean })
  readonly = false;

  @state()
  hasFocus = false;

  static get formControlValidators() {
    return [requiredValidator];
  }

  constructor() {
    super();
    new LangController(this);
    nextUniqueId++;
    this.inputId = `mid-phone-input-input-${nextUniqueId}`;
    this.validationId = `mid-phone-input-validation-${nextUniqueId}`;
  }

  get validationTarget() {
    return this.input;
  }

  validationMessageCallback(message: string) {
    this.invalidmessage = message;
  }

  resetFormControl() {
    this.invalidmessage = '';
  }

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

    this.formatter.input(this.value);
    this.country = this.formatter.getCountry() ?? this.country;
    this.countrycode = this.country
      ? `+${getCountryCallingCode(this.country)}`
      : '+';

    this.value = formatIncompletePhoneNumber(this.value);
    this.value ||= this.countrycode;
    this.nationalnumber = this.removePhonePrefix(this.value);
    this.setValue(this.value.replaceAll(' ', ''));

    setTimeout(() => {
      this.input.value = `${this.countrycode} ${this.nationalnumber}`;
    });
  }

  get parseTemplate() {
    return templateParser(this.currentTemplate, parsePhoneNumberCharacter);
  }

  get formatTemplate() {
    return templateFormatter(this.currentTemplate);
  }

  private handleBlur() {
    this.hasFocus = false;
    this.dispatchEvent(
      new Event('mid-blur', { bubbles: true, composed: true })
    );
  }

  private handleChange(event: Event) {
    // Event is dispatched after value is set
    this.currentEvent = new Event('mid-change', {
      bubbles: true,
      composed: true,
    });

    this.handleNewValue(event);
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Backspace' && this.input.selectionStart === 1) {
      // don't remove '+' symbol which is the first character
      event.preventDefault();
      return;
    }

    const hasModifier =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    // Pressing enter when focused on an input should submit the form like a native input, but we wait a tick before
    // submitting to allow users to cancel the keydown event if they need to
    if (event.key === 'Enter' && !hasModifier) {
      setTimeout(() => {
        //
        // When using an Input Method Editor (IME), pressing enter will cause the form to submit unexpectedly. One way
        // to check for this is to look at event.isComposing, which will be true when the IME is open.
        if (!event.defaultPrevented && !event.isComposing) {
          this.form.requestSubmit();
        }
      });
      return;
    }

    onKeyDown(
      event as any,
      this.input,
      this.parseTemplate,
      this.formatTemplate,
      this.valueChangeCallback
    );
  }

  private handleInput(event: InputEvent) {
    // Event is dispatched after value is set
    this.currentEvent = new Event('mid-input', {
      composed: true,
      bubbles: true,
    });
    this.handleNewValue(event);
  }

  private getCountryCodePrefix() {
    if (this.country) {
      return `+${getCountryCallingCode(this.country)}`;
    }

    return this.countrycode;
  }

  private applyAutocompletePrefix(value: string) {
    if (value.startsWith('+')) {
      return value;
    }

    const countryCodePrefix = this.getCountryCodePrefix();
    if (this.autocomplete === 'tel-national' && countryCodePrefix) {
      return `${countryCodePrefix}${value}`;
    }

    if (this.autocomplete === 'tel' && this.country) {
      const phoneNumber = parsePhoneNumberFromString(value, this.country);
      const valueWithPlus = `+${value.replaceAll(/\D/g, '')}`;

      if (phoneNumber?.isValid() && phoneNumber.number !== valueWithPlus) {
        return phoneNumber.number;
      }
    }

    return `+${value}`;
  }

  private handleNewValue(event: Event) {
    this.formatter.reset();

    this.input.value = this.applyAutocompletePrefix(this.input.value);

    this.formatter.input(this.input.value);
    this.currentTemplate = this.formatter.getTemplate();

    onChange(
      event as any,
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
        : (this.formatter.getCountry() ?? this.country);

    if (country !== this.country) {
      this.country = country;
      this.countrycode = this.country
        ? `+${getCountryCallingCode(this.country)}`
        : '+';
      this.skipCountryUpdate = true;
    }

    if (value !== this.value) {
      this.value = value;
      this.setValue(this.value.replaceAll(' ', ''));
      this.nationalnumber = this.removePhonePrefix(value);
    }

    this.dispatchEvent(this.currentEvent);
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

  focus(options?: FocusOptions): void {
    this.input.focus(options);
  }

  @watch('country', { waitUntilFirstUpdate: true })
  handleCountryChange() {
    if (this.skipCountryUpdate) {
      this.skipCountryUpdate = false;
      return;
    }

    this.formatter = new AsYouType(this.country);
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

    const lang = getLang(this);
    const t = getTranslations(lang);
    const hasLabelSlot = this.hasSlotControler.test('label');
    const hasLabel = !!this.label || !!hasLabelSlot;
    const hasError = this.invalid || !!this.invalidmessage;
    const describedBy = this.invalidmessage ? this.validationId : undefined;

    return html`
      <label
        id="${this.labelId}"
        class="${classMap({
          'sr-only': this.hidelabel || !hasLabel,
        })} mb-2 block items-center gap-1 font-medium"
      > 
      <div
        part="field"
        class="${classMap({
          'text-body-sm': sm,
          'text-body-md': md,
          'text-body-lg': lg,
        })}"
      >
        <label
          for="${this.inputId}"
          class="${classMap({
            'sr-only': this.hidelabel || !hasLabel,
          })} mb-2 inline-flex items-center gap-1 font-medium"
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
        <div part="base" class="flex h-12">
          <button
            part="country-button"
            aria-label=${t.openCountrySelector}
            class="${classMap({
              'border-neutral': !this.readonly,
              'border-neutral-subtle': this.readonly,
              'bg-neutral-surface-tinted': this.readonly,
              'bg-neutral-surface': !this.readonly,
            })} focus-visible:focus-ring flex h-full items-center rounded-l border border-r-0 pl-3"
            iconstyled
            variant="tertiary"
            ?disabled=${this.readonly}
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
            id="${this.inputId}"
            class="${classMap({
              'border-neutral': !hasError && !this.readonly,
              'border-danger': hasError && !this.readonly,
              'border-neutral-subtle': this.readonly,
              'bg-neutral-surface-tinted': this.readonly,
              'bg-neutral-surface': !this.readonly,
              'border-2': hasError,
              border: !hasError,
            })} focus-visible:focus-ring grow rounded-r px-3"
            part="phone-number"
            type="tel"
            autocomplete=${this.autocomplete}
            ?readonly=${this.readonly}
            value=${this.value}
            aria-describedby=${ifDefined(describedBy)}
            aria-invalid=${hasError ? 'true' : 'false'}
            aria-errormessage=${ifDefined(
              this.invalidmessage ? this.validationId : undefined
            )}
            @input=${this.handleInput}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
            @keydown=${this.handleKeydown}
            @change=${this.handleChange}
          />
        </div>
        <div
          class="text-danger-subtle mt-2 flex gap-1"
          id="${this.validationId}"
          aria-live="polite"
          ?hidden=${!this.invalidmessage}
        >
          <mid-icon
            name="xmark-octagon-fill"
            class="mt-1 min-h-5 min-w-5"
          ></mid-icon>
          ${this.invalidmessage}
        </div>
      </div>
    `;
  }
}
