import { css, html, LitElement, nothing, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { styled } from '../mixins/tailwind.mixin';
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js';
import {
  onChange,
  onKeyDown,
  parseDigit,
  templateFormatter,
  templateParser,
} from 'input-format';
import '@digdir/designsystemet-web/ds-suggestion';
import { watch } from '../internal/watch';
import { HasSlotController } from '../internal/slot';
import { FormControlMixin } from '../mixins/form-control.mixin';
import { requiredValidator } from '../mixins/validators';
import { LangController } from '../controllers/lang.controller.js';
import { getLang } from '../utilities/lang';
import { getTranslations } from '../utilities/translations';
import {
  countryLabelsEn,
  countryLabelsNn,
  countryLabelsNo,
  countryLabelsSe,
} from '../utilities/countries';

declare global {
  interface HTMLElementTagNameMap {
    'mid-phone-input': MinidPhoneInput;
  }
}

type PhoneAutocomplete = 'tel' | 'tel-national';

type CountryOption = { iso: CountryCode; dial: string; name: string };

/**
 * Country names per language. Bokmål and English are hand-curated; nynorsk
 * and Northern Sami are generated from CLDR (`pnpm make-country-labels`).
 * Any other language falls back to bokmål.
 */
const countryLabels: Record<string, Record<CountryCode, string>> = {
  nb: countryLabelsNo,
  nn: countryLabelsNn,
  se: countryLabelsSe,
  en: countryLabelsEn,
};

/** Fills `{code}` and `{country}` in a translated string */
function fillCountry(template: string, code: string, country: string) {
  return template.replace('{code}', code).replace('{country}', country);
}

/**
 * The country list, sorted by localized name. Built once per language and
 * shared by every instance.
 */
const optionCache = new Map<string, CountryOption[]>();

function getCountryOptions(lang: string): CountryOption[] {
  const base = lang.toLowerCase().split('-')[0];
  const key = base in countryLabels ? base : 'nb';
  let list = optionCache.get(key);
  if (!list) {
    const labels = countryLabels[key];
    list = getCountries()
      .map((iso) => ({
        iso,
        dial: getCountryCallingCode(iso),
        name: labels[iso] ?? iso,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, key === 'en' ? 'en' : 'nb'));
    optionCache.set(key, list);
  }
  return list;
}

/**
 * Calling codes shared by several countries, and the country a bare code
 * should resolve to.
 */
const MAIN_COUNTRY_FOR_DIAL: Record<string, CountryCode> = {
  '1': 'US',
  '7': 'RU',
  '39': 'IT',
  '44': 'GB',
  '47': 'NO',
  '61': 'AU',
  '212': 'MA',
  '262': 'RE',
  '290': 'SH',
  '358': 'FI',
  '590': 'GP',
  '599': 'CW',
};

const styles = [
  css`
    :host {
      display: block;
    }

    .ds-fieldset {
      --dsc-fieldset-gap: var(--ds-size-2);
    }

    /* A visually hidden legend or description must not leave its gap behind */
    .ds-fieldset > .sr-only + * {
      margin-block-start: 0;
    }

    /* The two inputs read as one field: no gap, shared radius, one seam */
    .phone-row {
      display: flex;
      align-items: flex-start;
    }

    .country {
      display: block;
      flex: 0 0 auto;
      inline-size: var(--mid-phone-input-country-width, 7.5rem);
    }

    .country-input {
      inline-size: 100%;
      min-inline-size: 0;
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }

    /* Designsystemet draws the chevron on the suggestion input; not when read-only */
    .country-input[readonly] {
      background-image: none;
      padding-inline-end: var(--dsc-input-padding-inline, var(--ds-size-3));
    }

    .number-input {
      flex: 1 1 auto;
      inline-size: auto;
      min-inline-size: 0;
      border-start-start-radius: 0;
      border-end-start-radius: 0;
      /* overlap the neighbour's border so the seam is one stroke wide */
      margin-inline-start: calc(-1 * var(--dsc-input-border-width));
    }

    /* The hovered or focused half draws its outline above its neighbour */
    .phone-row .ds-input:hover,
    .phone-row .ds-input:focus-visible {
      position: relative;
      z-index: 1;
    }

    /* An error colours the whole field, not only the number half */
    .phone-row--invalid .country-input {
      border-color: var(--dsc-input-accent-color--invalid);
    }

    /* The list floats in the top layer; give it room for the long names */
    .country-list {
      min-inline-size: 18rem;
    }

    .country-dial {
      white-space: nowrap;
    }

    /* The validation message stays in the DOM so its text lands in a live region
       the screen reader is already watching (see textfield). When empty it must
       paint nothing and take no room. */
    .ds-fieldset > .validation-message--empty {
      margin-top: 0;
    }
  `,
];

let nextUniqueId = 0;

/**
 * A phone number field with a separate country-code control to the left of the
 * national number. The country list is built in (no flags): type a dial code,
 * an ISO code or a country name to filter it. Typing or pasting an
 * international number (`+46…` or `0046…`) into the number field switches the
 * country and keeps the national part.
 *
 * @event {Event} mid-change - Emitted when the number is modified by the user or the country is changed by the user
 * @event {Event} mid-input - Emitted after a new user input in the number field or a user-driven country change
 * @event {Event} mid-blur - Emitted after focus is moved away from the number input
 * @event {Event} mid-focus - Emitted after the number input gains focus
 * @event {detail: { validity: ValidityState }} mid-invalid-show - Emitted when the error message should be shown
 * @event {detail: { validity: ValidityState }} mid-invalid-hide - Emitted when the error message should be hidden
 *
 * @slot label - The field's label (rendered as the group legend). Alternatively, you can use the `label` attribute.
 * @slot description - The description if you need HTML. Alternatively, you can use the `description` attribute.
 *
 * @part field - The `fieldset` around the legend, description, inputs and validation message
 * @part label - The legend element
 * @part description - The description element
 * @part base - The row that holds the country-code control and the number input
 * @part country-input - The country-code input (a combobox)
 * @part country-list - The country list
 * @part phone-number - The phone number input
 * @part validation-message - The error message shown by `invalidmessage`
 */
@customElement('mid-phone-input')
export class MinidPhoneInput extends FormControlMixin(
  styled(LitElement, styles)
) {
  private readonly inputId: string;
  private readonly countryInputId: string;
  private readonly countryNameId: string;
  private readonly countryHintId: string;
  private readonly listId: string;
  private readonly descriptionId: string;
  private readonly validationId: string;
  private formatter = new AsYouType('NO');
  private currentEvent = new Event(''); // the event to be emitted after value is set
  private currentTemplate = '';
  private appliedCountry?: CountryCode;
  private internalValue = '';
  private initialValue = '';
  private selectOnMouseUp = false;
  /** Set by `announceCountryChange`; rendered in a polite status region */
  @state() private countryAnnouncement = '';
  private hasSlotControler = new HasSlotController(
    this,
    'label',
    'description'
  );

  @query('.number-input')
  input!: HTMLInputElement;

  @query('.country-input')
  countryInput!: HTMLInputElement;

  @query('.country-list')
  countryList!: HTMLElement;

  /**
   * The phone number in E.164 format, e.g. `"+4799999999"`. Empty when no
   * national number has been entered. A value without `+` is read as a
   * national number for the selected country.
   */
  @property({ reflect: true })
  value = '';

  /**
   * The national number without the country code, digits only. Example: `"99999999"`
   */
  @property({ reflect: true })
  nationalnumber = '';

  /**
   * The dial code of the selected country. Example: `"+47"`
   */
  @property({ reflect: true })
  countrycode = '';

  /**
   * Label for the field, rendered as the group legend.
   */
  @property()
  label = '';

  /**
   * Hide label visually. Still available for screen readers
   */
  @property({ type: Boolean })
  hidelabel = false;

  /**
   * Description shown between the label and the inputs. Use the `description`
   * slot when the text needs HTML.
   */
  @property()
  description = '';

  /**
   * Visually hides `description` (still available for screen readers).
   * Independent of `hidelabel`.
   */
  @property({ type: Boolean })
  hidedescription = false;

  /**
   * The selected country as a two letter ISO code like `"NO"`. Defaults to
   * Norway unless `value` carries another country code.
   */
  @property({ reflect: true })
  country: CountryCode = 'NO';

  /**
   * The browser autofill token for the number input. `tel-national` expects
   * the national number. `tel` expects a full number; a value with a country
   * code switches the country.
   */
  @property()
  autocomplete: PhoneAutocomplete = 'tel-national';

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
   * Makes the number required
   */
  @property({ type: Boolean })
  required = false;

  /**
   * Makes both inputs read-only, meaning the user cannot change the value.
   * The country control is then a plain read-only input, not a combobox.
   */
  @property({ type: Boolean })
  readonly = false;

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  static get formControlValidators() {
    return [requiredValidator];
  }

  constructor() {
    super();
    new LangController(this);
    nextUniqueId++;
    this.inputId = `mid-phone-input-input-${nextUniqueId}`;
    this.countryInputId = `mid-phone-input-country-${nextUniqueId}`;
    this.countryNameId = `mid-phone-input-country-name-${nextUniqueId}`;
    this.countryHintId = `mid-phone-input-country-hint-${nextUniqueId}`;
    this.listId = `mid-phone-input-list-${nextUniqueId}`;
    this.descriptionId = `mid-phone-input-description-${nextUniqueId}`;
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
    this.applyValue(this.initialValue);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.applyValue(this.value);
    this.initialValue = this.value;
  }

  protected firstUpdated(changed: PropertyValues): void {
    super.firstUpdated(changed);
    this.input.value = this.formatNational(this.country, this.nationalnumber);
  }

  focus(options?: FocusOptions): void {
    this.input.focus(options);
  }

  /* ---------- value model ---------- */

  private get countryOptionEls() {
    return Array.from(
      this.countryList?.querySelectorAll<HTMLOptionElement>('u-option') ?? []
    );
  }

  /**
   * The national number as the country writes it, trunk prefix included
   * (`070-123 45 67` for +46701234567); as-you-type formatting for
   * incomplete numbers.
   */
  private formatNational(iso: CountryCode, national: string) {
    if (!national) return '';
    const parsed = parsePhoneNumberFromString(
      `+${getCountryCallingCode(iso)}${national}`
    );
    if (parsed?.isPossible()) return parsed.formatNational();
    return new AsYouType(iso).input(national);
  }

  private resolveCountryForDial(dial: string, preferred?: CountryCode) {
    const same = getCountries().filter(
      (c) => getCountryCallingCode(c) === dial
    );
    if (!same.length) return undefined;
    return (
      same.find((c) => c === preferred) ??
      MAIN_COUNTRY_FOR_DIAL[dial] ??
      same[0]
    );
  }

  private setCountry(iso: CountryCode) {
    this.country = iso;
    this.appliedCountry = iso;
    this.countrycode = `+${getCountryCallingCode(iso)}`;
    this.formatter = new AsYouType(iso);
  }

  /**
   * Splits a programmatic `value` into country and national number. Silent:
   * the form value is synced without touching the error state.
   */
  private applyValue(value: string) {
    let iso: CountryCode = this.country ?? 'NO';
    let national = '';
    const text = (value ?? '').trim().replace(/^00/, '+');

    if (text.startsWith('+')) {
      const ayt = new AsYouType();
      ayt.input(text);
      const dial = ayt.getCallingCode();
      if (dial) {
        iso = ayt.getCountry() ?? this.resolveCountryForDial(dial, iso) ?? iso;
        national = ayt.getNationalNumber();
      }
    } else if (text) {
      const ayt = new AsYouType(iso);
      ayt.input(text);
      national = ayt.getNationalNumber();
    }

    this.setCountry(iso);
    this.nationalnumber = national;
    this.value = national ? `${this.countrycode}${national}` : '';
    this.internalValue = this.value;
    this.syncFormValue(this.value);

    if (this.input) {
      this.input.value = this.formatNational(iso, national);
    }
    if (this.countryInput) {
      this.countryInput.value = this.countrycode;
    }
  }

  private applyCountry(
    iso: CountryCode,
    {
      userInitiated,
      reformat = true,
    }: { userInitiated: boolean; reformat?: boolean }
  ) {
    this.setCountry(iso);

    if (reformat && this.input) {
      this.input.value = this.formatNational(iso, this.nationalnumber);
    }

    const next = this.nationalnumber
      ? `${this.countrycode}${this.nationalnumber}`
      : '';
    this.value = next;
    this.internalValue = next;

    if (userInitiated) {
      this.setValue(next);
      this.dispatchEvent(
        new Event('mid-input', { bubbles: true, composed: true })
      );
      this.dispatchEvent(
        new Event('mid-change', { bubbles: true, composed: true })
      );
    } else {
      this.syncFormValue(next);
    }

    // u-combobox restores the old text when a selection is cancelled; show the
    // new dial code once the <data> element has been re-rendered.
    this.updateComplete.then(() => this.restoreCountryText());
  }

  @watch('country', { waitUntilFirstUpdate: true })
  handleCountryChange(_old?: unknown, next?: unknown) {
    const iso = next as CountryCode | undefined;
    if (iso && iso !== this.appliedCountry) {
      this.applyCountry(iso, { userInitiated: false });
    }
  }

  @watch('value', { waitUntilFirstUpdate: true })
  handleValueChange(_old?: unknown, next?: unknown) {
    const value = (next as string | undefined) ?? '';
    if (value !== this.internalValue) {
      this.applyValue(value);
    }
  }

  /* ---------- number input ---------- */

  get parseTemplate() {
    return templateParser(this.currentTemplate, parseDigit);
  }

  get formatTemplate() {
    return templateFormatter(this.currentTemplate);
  }

  private handleBlur() {
    this.dispatchEvent(
      new Event('mid-blur', { bubbles: true, composed: true })
    );
  }

  private handleFocus() {
    this.dispatchEvent(
      new Event('mid-focus', { composed: true, bubbles: true })
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

  private handleInput(event: InputEvent) {
    // Event is dispatched after value is set
    this.currentEvent = new Event('mid-input', {
      composed: true,
      bubbles: true,
    });
    this.handleNewValue(event);
  }

  private handleKeydown(event: KeyboardEvent) {
    const hasModifier =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    // Pressing enter when focused on an input should submit the form like a native input, but we wait a tick before
    // submitting to allow users to cancel the keydown event if they need to
    if (event.key === 'Enter' && !hasModifier) {
      setTimeout(() => {
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

  private handleNewValue(event: Event) {
    const raw = this.input.value;

    if (/^\s*(\+|00)/.test(raw)) {
      this.adoptInternationalInput(raw);
      return;
    }

    this.formatter.reset();
    this.formatter.input(raw);
    this.currentTemplate = this.formatter.getTemplate();

    onChange(
      event as any,
      this.input,
      this.parseTemplate,
      this.formatTemplate,
      this.valueChangeCallback
    );
  }

  /**
   * A full international number typed, pasted or autofilled into the number
   * field: move the country code to the country control and keep the rest.
   */
  private adoptInternationalInput(raw: string) {
    const ayt = new AsYouType();
    ayt.input(raw.trim().replace(/^00/, '+'));
    const dial = ayt.getCallingCode();
    if (!dial) {
      // "+4" so far: wait for more digits
      return;
    }

    const iso =
      ayt.getCountry() ?? this.resolveCountryForDial(dial, this.country);
    if (iso && iso !== this.country) {
      this.applyCountry(iso, { userInitiated: false, reformat: false });
      void this.announceCountryChange();
    }

    const national = ayt.getNationalNumber();
    this.input.value = this.formatNational(this.country, national);
    const end = this.input.value.length;
    this.input.setSelectionRange(end, end);
    this.formatter.reset();
    this.formatter.input(this.input.value);
    this.currentTemplate = this.formatter.getTemplate();
    this.valueChangeCallback(national);
  }

  private countryName(lang = getLang(this)) {
    return (
      getCountryOptions(lang).find((o) => o.iso === this.country)?.name ?? ''
    );
  }

  /**
   * The country moved without the user touching the country control (a
   * `+46…` typed or pasted into the number field): say so once, politely.
   */
  private async announceCountryChange() {
    const lang = getLang(this);
    const message = fillCountry(
      getTranslations(lang).countryCodeChanged,
      this.countrycode,
      this.countryName(lang)
    );
    // Clear first so the same switch twice in a row is announced again
    this.countryAnnouncement = '';
    await this.updateComplete;
    this.countryAnnouncement = message;
  }

  private valueChangeCallback = (digits: string) => {
    const ayt = new AsYouType(this.country);
    ayt.input(digits);
    this.nationalnumber = ayt.getNationalNumber();

    const next = this.nationalnumber
      ? `${this.countrycode}${this.nationalnumber}`
      : '';
    if (next !== this.value) {
      this.value = next;
      this.internalValue = next;
      this.setValue(next);
    }

    this.dispatchEvent(this.currentEvent);
  };

  /* ---------- country control (ds-suggestion / u-combobox) ---------- */

  private matchesCountry(option: CountryOption, query: string) {
    const digits = query.replace(/^(\+|00)/, '');
    return (
      option.name.toLowerCase().includes(query) ||
      option.iso.toLowerCase() === query ||
      (/^\d+$/.test(digits) && option.dial.startsWith(digits))
    );
  }

  /**
   * Resolves free text to a country: a unique match, an exact name, a dial
   * code (preferring the current country, then the main country for that
   * code) or an ISO code that is not also the start of a name. `undefined`
   * keeps the current country.
   */
  private resolveCountryQuery(text: string): CountryCode | undefined {
    const query = text.trim().toLowerCase();
    if (!query) return undefined;

    const options = getCountryOptions(getLang(this));
    const hits = options.filter((o) => this.matchesCountry(o, query));
    if (hits.length === 1) return hits[0].iso;

    const byName = options.find((o) => o.name.toLowerCase() === query);
    if (byName) return byName.iso;

    const digits = query.replace(/^(\+|00)/, '');
    if (/^\d+$/.test(digits)) {
      return this.resolveCountryForDial(digits, this.country);
    }

    // An ISO code only counts when the text is not also the start of a
    // country name: "sv" is Sveits/Sverige/Svalbard before it is El Salvador.
    const startsAName = options.some((o) =>
      o.name.toLowerCase().startsWith(query)
    );
    if (!startsAName) {
      return options.find((o) => o.iso.toLowerCase() === query)?.iso;
    }

    return undefined;
  }

  private restoreCountryText() {
    if (this.countryInput && this.countryInput.value !== this.countrycode) {
      this.countryInput.value = this.countrycode;
    }
  }

  /** Lit owns the `<data>` element; u-combobox must neither insert nor remove one. */
  private handleCountryBeforeSelect = (event: CustomEvent<HTMLDataElement>) => {
    event.preventDefault();
    const data = event.detail;

    if (data.isConnected) {
      // an attempt to remove the current selection (text cleared and blurred)
      this.restoreCountryText();
      return;
    }

    const iso = data.value as CountryCode;
    if (iso !== this.country) {
      this.applyCountry(iso, { userInitiated: true });
    } else {
      this.restoreCountryText();
    }
  };

  /** Free text on blur/Enter: pick our own match and let u-combobox select it. */
  private handleCountryBeforeMatch = (
    event: CustomEvent<HTMLOptionElement | undefined>
  ) => {
    const iso =
      this.resolveCountryQuery(this.countryInput.value) ?? this.country;
    for (const option of this.countryOptionEls) {
      option.selected = option.value === iso;
    }
    event.preventDefault();
  };

  private handleCountryInput = () => {
    const query = this.countryInput.value.trim().toLowerCase();
    const showAll = !query || query === this.countrycode.toLowerCase();
    const byIso = new Map(
      getCountryOptions(getLang(this)).map((o) => [o.iso, o])
    );
    for (const option of this.countryOptionEls) {
      const country = byIso.get(option.value as CountryCode);
      option.hidden =
        !showAll && !!country && !this.matchesCountry(country, query);
    }
  };

  private handleCountryFocus = () => {
    this.handleCountryInput();
    // Typing replaces the dial code
    this.selectOnMouseUp = true;
    this.countryInput.select();
  };

  private handleCountryMouseUp = (event: MouseEvent) => {
    // Safari collapses the selection on mouseup after a click-to-focus
    if (this.selectOnMouseUp) {
      event.preventDefault();
      this.selectOnMouseUp = false;
    }
  };

  private handleCountryBlur = () => {
    this.selectOnMouseUp = false;
  };

  override render() {
    const lang = getLang(this);
    const t = getTranslations(lang);
    const options = getCountryOptions(lang);
    const countryName = this.countryName(lang);
    const countryHint = fillCountry(
      t.countryCodeSelected,
      this.countrycode,
      countryName
    );
    const hasLabelSlot = this.hasSlotControler.test('label');
    const hasLabel = !!this.label || !!hasLabelSlot;
    const hasDescriptionSlot = this.hasSlotControler.test('description');
    const hasDescription = !!this.description || !!hasDescriptionSlot;
    const hasError = this.invalid || !!this.invalidmessage;
    // The selected country code first (it frames what "Telefonnummer" means
    // for a user sent straight to the number field), then the description,
    // then the error.
    const describedBy = [
      this.countryHintId,
      hasDescription ? this.descriptionId : undefined,
      this.invalidmessage ? this.validationId : undefined,
    ]
      .filter(Boolean)
      .join(' ');

    // Read-only: a plain input. u-datalist would otherwise leave combobox ARIA
    // attributes on a read-only input it no longer treats as a combobox.
    const countryControl = this.readonly
      ? html`
          <span class="country">
            <input
              id="${this.countryInputId}"
              part="country-input"
              class="ds-input country-input"
              type="text"
              readonly
              .value=${this.countrycode}
              aria-describedby="${this.countryNameId}"
            />
            <span id="${this.countryNameId}" class="sr-only"
              >${countryName}</span
            >
          </span>
        `
      : html`
          <ds-suggestion
            class="ds-suggestion country"
            @comboboxbeforeselect=${this.handleCountryBeforeSelect}
            @comboboxbeforematch=${this.handleCountryBeforeMatch}
          >
            <data value=${this.country}>${this.countrycode}</data>
            <input
              id="${this.countryInputId}"
              part="country-input"
              class="ds-input country-input"
              type="text"
              list="${this.listId}"
              value=${this.countrycode}
              autocapitalize="characters"
              spellcheck="false"
              aria-describedby="${this.countryNameId}"
              @focus=${this.handleCountryFocus}
              @mouseup=${this.handleCountryMouseUp}
              @input=${this.handleCountryInput}
              @blur=${this.handleCountryBlur}
            />
            <span id="${this.countryNameId}" class="sr-only"
              >${countryName}</span
            >
            <u-datalist
              id="${this.listId}"
              part="country-list"
              class="country-list"
              data-placement="bottom-start"
              data-nofilter
              data-sr-singular=${t.countrySuggestionsSingular}
              data-sr-plural=${t.countrySuggestionsPlural}
            >
              ${repeat(
                options,
                (o) => o.iso,
                (o) => html`
                  <u-option
                    value=${o.iso}
                    label="${o.name} (+${o.dial})"
                    ?selected=${o.iso === this.country}
                  >
                    ${o.name}
                    <span class="country-dial">(+${o.dial})</span>
                  </u-option>
                `
              )}
            </u-datalist>
          </ds-suggestion>
        `;

    return html`
      <fieldset part="field" class="ds-fieldset" data-size=${this.size}>
        <legend
          part="label"
          class="${classMap({
            'sr-only': this.hidelabel || !hasLabel,
          })} ds-label"
        >
          <slot name="label">${this.label}</slot>
        </legend>
        ${hasDescription
          ? html`
              <div
                id="${this.descriptionId}"
                part="description"
                data-field="description"
                aria-hidden="true"
                class="${classMap({
                  'sr-only': this.hidedescription,
                })}"
              >
                <slot name="description">${this.description}</slot>
              </div>
            `
          : nothing}
        <div
          part="base"
          class="${classMap({
            'phone-row': true,
            'phone-row--invalid': hasError,
          })}"
        >
          <label class="sr-only" for="${this.countryInputId}"
            >${t.countryCode}</label
          >
          ${countryControl}

          <label class="sr-only" for="${this.inputId}">${t.phoneNumber}</label>
          <input
            id="${this.inputId}"
            part="phone-number"
            class="ds-input number-input"
            type="tel"
            inputmode="tel"
            autocomplete=${this.autocomplete}
            ?readonly=${this.readonly}
            aria-describedby=${describedBy}
            aria-invalid=${hasError ? 'true' : 'false'}
            aria-errormessage=${ifDefined(
              this.invalidmessage ? this.validationId : undefined
            )}
            @input=${this.handleInput}
            @change=${this.handleChange}
            @keydown=${this.handleKeydown}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
          />
          <span id="${this.countryHintId}" class="sr-only" aria-hidden="true"
            >${countryHint}</span
          >
          <span class="sr-only" role="status">${this.countryAnnouncement}</span>
        </div>
        <p
          class="${classMap({
            'ds-validation-message': !!this.invalidmessage,
            'validation-message--empty': !this.invalidmessage,
          })}"
          part="validation-message"
          id="${this.validationId}"
          aria-live="polite"
        >
          ${this.invalidmessage}
        </p>
      </fieldset>
    `;
  }
}
