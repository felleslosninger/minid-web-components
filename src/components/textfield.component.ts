import { css, html, LitElement, nothing, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { stringConverter } from '../internal/string-converter';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from '../mixins/tailwind.mixin.ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import { HasSlotController } from '../internal/slot';
import { FormControlMixin } from '../mixins/form-control.mixin';
import {
  maxLengthValidator,
  minLengthValidator,
  patternValidator,
  requiredValidator,
  typeMismatchValidator,
} from '../mixins/validators';
import { watch } from '../internal/watch';
import './icon/icon.component.ts';
import { MaskInput, type MaskType } from 'maska';
import { getLang } from '../utilities/lang';
import { getTranslations } from '../utilities/translations';
import { LangController } from '../controllers/lang.controller.js';

declare global {
  interface HTMLElementTagNameMap {
    'mid-textfield': MinidTextfield;
  }
}

const styles = [
  css`
    :host {
      display: block;
    }

    /* Hide increment/decrement buttons on inputs */
    input[type='number']::-webkit-outer-spin-button,
    input[type='number']::-webkit-inner-spin-button,
    input[type='number'] {
        -webkit-appearance: none;
        margin: 0;
        -moz-appearance: textfield !important;
    }

    .ds-field-affixes {
      background: var(--ds-color-neutral-background-tinted);
    }

    .has-field-buttons {
      --mid-field-button-size: var(--ds-size-7);
      --mid-field-button-gap: var(--ds-size-3);
      --mid-field-button-border: var(--ds-border-width-default);
      position: relative;
      display: block;
    }

    .has-field-buttons .ds-input {
      padding-inline-end: calc(
        var(--mid-field-button-size) + 2 * var(--mid-field-button-gap)
      );
    }

    .has-field-buttons--two .ds-input {
      padding-inline-end: calc(
        2 * (var(--mid-field-button-size) + 2 * var(--mid-field-button-gap))
      );
    }

    .password-toggle-input::-ms-reveal,
    .password-toggle-input::-ms-clear {
      display: none;
    }

    .has-field-buttons .ds-input::-webkit-credentials-auto-fill-button {
      margin-inline-end: calc(
        var(--mid-field-button-size) + 2 * var(--mid-field-button-gap)
      );
    }

    .has-field-buttons--two .ds-input::-webkit-credentials-auto-fill-button {
      margin-inline-end: calc(
        2 * (var(--mid-field-button-size) + 2 * var(--mid-field-button-gap))
      );
    }

    .has-field-buttons:hover
      .ds-input:not(:focus-visible, :disabled, [readonly], [aria-readonly='true']) {
      outline: var(--dsc-input-outline-width--hover)
        var(--dsc-input-outline-style--hover)
        var(--dsc-input-outline-color--hover);
    }

    .has-field-buttons:hover
      .ds-input[aria-invalid='true']:not(:focus-visible, :disabled, [readonly], [aria-readonly='true']) {
      outline-color: var(--dsc-input-accent-color--invalid);
    }

    .field-buttons {
      position: absolute;
      inset-block: var(--mid-field-button-border);
      inset-inline-end: var(--mid-field-button-border);
      display: flex;
      pointer-events: none;
    }

    .field-button {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ds-color-neutral-text-subtle);
      pointer-events: auto;
    }

    .field-buttons .field-button {
      padding-inline: var(--mid-field-button-gap);
    }

    .field-button > span {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--ds-border-radius-sm);
      block-size: var(--mid-field-button-size, var(--ds-size-7));
      inline-size: var(--mid-field-button-size, var(--ds-size-7));
    }

    .field-button mid-icon {
      font-size: var(--mid-field-button-size, var(--ds-size-7));
    }

    .field-button:focus-visible {
      outline: none;
    }

    .field-button:focus-visible > span {
      box-shadow: 0 0 0 var(--ds-border-width-focus) var(--ds-color-focus-inner);
      outline: var(--ds-color-focus-outer) solid var(--ds-border-width-focus);
      outline-offset: var(--ds-border-width-focus);
    }

    /* The validation message stays in the DOM so its text lands in a live region
       the screen reader is already watching - WebKit does not reliably announce
       one revealed at the same moment the text arrives. When empty it must paint
       nothing and take no room: the element drops the ds-validation-message class
       (whose ::before paints an error icon regardless of the text) and this rule
       cancels the sibling spacing from .ds-field > * + *, which the .ds-field >
       prefix is enough to outrank without !important. */
    .ds-field > .validation-message--empty {
      margin-top: 0;
    }
  `,
];

let nextUniqueId = 0;

/**
 *
 * @event mid-change - Emitted when a change to the input value is comitted by the user
 * @event mid-input - Emitted when the input element recieves input
 * @event mid-clear - Emitted when the input value is cleared
 * @event mid-focus - Emitted when input element is focused
 * @event mid-blur - Emitted when focus moves away from input element
 * @event {detail: { validity: ValidityState }} mid-invalid-hide - Emitted when the error message should be hidden
 * @event {detail: { validity: ValidityState }} mid-invalid-show - Emitted when the error message should be shown
 *
 * @slot prefix - Used for decoration to the left of the input
 * @slot suffix - Used for decoration to the right of the input
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 *
 * @csspart base - The input's wrapper that has the input field styling.
 * @csspart input - The internal `<input>` element.
 * @csspart field - The element that wraps the label, input, and help text.
 * @csspart description - The description shown between the label and the input.
 * @csspart clear-button - The clear button
 * @csspart password-toggle-button - The button for toggling password visibility
 * @csspart validation-message - The error message shown by `invalidmessage`.
 */
@customElement('mid-textfield')
export class MinidTextfield extends FormControlMixin(styled(LitElement, styles)) {
  private readonly inputId!: string;
  private readonly descriptionId!: string;
  private readonly validationId!: string;
  private readonly hasSlotControler = new HasSlotController(this, 'label', 'prefix', 'suffix');
  private inputMask?: MaskInput;
  private initialValue = '';

  @query('input')
  input!: HTMLInputElement;

  @property()
  label = '';

  @property()
  description = '';

  @property()
  value = '';

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  @property({ converter: stringConverter })
  placeholder?: string;

  /**
   * Autofocus the input field on page load
   */
  @property({ type: Boolean })
  autofocus = false;

  /**
   * User agent autocomplete hint
   */
  @property()
  autocomplete?: AutoFill;

  /**
   *  The minimum length of input that will be considered valid.
   */
  @property({ type: Number })
  minlength?: number;

  /**
   *  The maximum length of input that will be considered valid.
   */
  @property({ type: Number })
  maxlength?: number;

  /**
   * The input's minimum value. Only applies to date and number input types.
   */
  @property()
  min?: number | string;

  /**
   * The input's maximum value. Only applies to date and number input types.
   */
  @property()
  max?: number | string;

  /**
   * Error message to display when the input is invalid, also activates invalid styling
   */
  @property()
  invalidmessage = '';

  @property()
  type:
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'month'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week' = 'text';

  /**
   * For displaying appropriate virtual keyboard
   */
  @property()
  inputmode:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal' = 'text';

  /**
   * Adds a clear button when the input is not empty.
   */
  @property({ type: Boolean })
  clearable = false;

  /**
   * Adds a button to toggle the password's visibility.
   * Only applies if type is password
   */
  @property({ type: Boolean })
  passwordtoggle = false;

  /**
   * Determines wether the password is currently visible.
   * Only applies if type is password
   */
  @property({ type: Boolean })
  passwordvisible = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  /**
   * A regular expression pattern to validate input against.
   */
  @property()
  pattern?: string;

  /**
   * Makes the input required
   */
  @property({ type: Boolean })
  required = false;

  /**
   * Visually hides `label` and `description` (still available for screen readers)
   */
  @property({ type: Boolean })
  hidelabel = false;

  /**
   * Visually hides `description` while leaving `label` visible. The description
   * keeps its id and is still announced through `aria-describedby`.
   * `hidelabel` continues to hide both label and description.
   */
  @property({ type: Boolean })
  hidedescription = false;

  /**
   * Modify input value based on mask e.g:  `"##:##"` = 12:34.
   * `#`: /[0-9]/
   * `@`: /[a-zA-Z]/
   * `*`: /[a-zA-Z0-9]/
   * For more information go to https://beholdr.github.io/maska
   */
  @property()
  mask?: MaskType;

  @state()
  hasFocus = false;

  static get formControlValidators() {
    return [
      requiredValidator,
      maxLengthValidator,
      minLengthValidator,
      patternValidator,
      typeMismatchValidator,
    ];
  }

  constructor() {
    super();
    new LangController(this);
    nextUniqueId++;
    this.inputId = `mid-textfield-input-${nextUniqueId}`;
    this.descriptionId = `mid-textfield-description-${nextUniqueId}`;
    this.validationId = `mid-textfield-validation-${nextUniqueId}`;
    this.setValue(this.value);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.initialValue = this.value;
  }

  get validationTarget() {
    return this.input;
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.setValue(this.value);
  }

  disconnectedCallback(): void {
    this.inputMask?.destroy();
  }

  private handleKeydown(event: KeyboardEvent) {
    const hasModifier =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    if (event.key === 'Enter' && !hasModifier) {
      setTimeout(() => {
        if (!event.defaultPrevented && !event.isComposing) {
          this.form.requestSubmit();
        }
      });
    }
  }

  private handleBlur() {
    this.hasFocus = false;
    this.dispatchEvent(
      new Event('mid-blur', { bubbles: true, composed: true })
    );
  }

  private handleChange() {
    this.value = this.input.value;
    this.dispatchEvent(
      new Event('mid-change', { bubbles: true, composed: true })
    );
  }

  private handleInput() {
    let tmp_value = this.input.value;

    if (this.type === 'number') {
      tmp_value = tmp_value.replace(/[^0-9]/g, '');
    }

    this.value = tmp_value;
    this.setValue(this.value);
    this.dispatchEvent(
      new Event('mid-input', { bubbles: true, composed: true })
    );
  }

  private handleFocus() {
    this.hasFocus = true;
    this.dispatchEvent(
      new Event('mid-focus', { composed: true, bubbles: true })
    );
  }

  private handlePasswordToggle() {
    this.passwordvisible = !this.passwordvisible;
  }

  private handleInFieldButtonMousedown(event: MouseEvent) {
    event.preventDefault();
  }

  private handleClearClick(event: MouseEvent) {
    event.preventDefault();

    if (this.value !== '') {
      this.value = '';
      this.dispatchEvent(
        new Event('mid-clear', { composed: true, bubbles: true })
      );
      this.dispatchEvent(
        new Event('mid-input', { composed: true, bubbles: true })
      );
      this.dispatchEvent(
        new Event('mid-change', { composed: true, bubbles: true })
      );
    }

    this.input.focus();
  }

  focus() {
    this.hasFocus = true;
    this.input.focus();
  }

  resetFormControl() {
    this.invalidmessage = '';
    this.value = this.initialValue;
  }

  forceError(message?: string): void {
    super.forceError(message);
  }

  @watch('value')
  handleValueUpdate() {
    this.setValue(this.value);
  }

  @watch('mask')
  async handleMaskUpdate() {
    if (!this.mask) return;
    await this.updateComplete;
    this.inputMask?.destroy();
    this.inputMask = new MaskInput(this.input, {
      mask: this.mask,
      eager: true,
    });
  }

  override render() {
    const lang = getLang(this);
    const t = getTranslations(lang);
    const hasLabelSlot = this.hasSlotControler.test('label');
    const hasLabel = !!this.label || !!hasLabelSlot;
    const hasPrefix = this.hasSlotControler.test('prefix');
    const hasSuffix = this.hasSlotControler.test('suffix');
    const hasClearIcon = this.clearable && !this.disabled && !this.readonly;
    const hasPasswordToggle = this.passwordtoggle && !this.disabled;
    const overlayFieldButtons =
      (hasClearIcon || hasPasswordToggle) && !hasPrefix && !hasSuffix;
    const hasAffixes = hasPrefix || hasSuffix;
    const isClearIconVisible =
      hasClearIcon && (typeof this.value === 'number' || this.value.length > 0);
    const describedBy = [
      this.description ? this.descriptionId : undefined,
      this.invalidmessage ? this.validationId : undefined,
    ]
      .filter(Boolean)
      .join(' ');

    const passwordToggleButton = html`
      <button
        type="button"
        part="password-toggle-button"
        class="field-button"
        aria-label=${this.passwordvisible ? t.hidePassword : t.showPassword}
        aria-controls=${this.inputId}
        @mousedown=${this.handleInFieldButtonMousedown}
        @click=${this.handlePasswordToggle}
      >
        <span>
          <mid-icon
            library="system"
            name=${this.passwordvisible ? 'eye-slash' : 'eye'}
          ></mid-icon>
        </span>
      </button>
    `;

    const clearButton = html`
      <button
        type="button"
        part="clear-button"
        class="field-button"
        aria-label=${t.clear}
        @mousedown=${this.handleInFieldButtonMousedown}
        @click=${this.handleClearClick}
      >
        <span>
          <mid-icon library="nav-aksel" name="trash"></mid-icon>
        </span>
      </button>
    `;

    return html`
      <ds-field
        part="field"
        class="ds-field"
        data-size=${this.size}
      >
        <label
          for="${this.inputId}"
          class="${classMap({
            'sr-only': this.hidelabel || !hasLabel,
          })} ds-label"
        >
          <slot name="label"> ${this.label} </slot>
        </label>
        ${this.description
          ? html`
              <div
                id="${this.descriptionId}"
                part="description"
                aria-hidden="true"
                class="${classMap({
                  'sr-only': this.hidelabel || this.hidedescription,
                })}"
              >
                ${this.description}
              </div>
            `
          : nothing}
        <div
          part="base"
          class="${classMap({
            'ds-field-affixes': hasAffixes,
            'has-field-buttons': overlayFieldButtons,
            'has-field-buttons--two':
              overlayFieldButtons && hasClearIcon && hasPasswordToggle,
          })}"
        >
          ${hasPrefix ? html`<span class="ds-field-affix"><slot name="prefix"></slot></span>` : html`<slot name="prefix"></slot>`}
          <input
            id="${this.inputId}"
            class="${classMap({
              'ds-input': true,
              'password-toggle-input': hasPasswordToggle,
            })}"
            part="input"
            lang=${lang}
            .value=${live(this.value)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            ?autofocus=${this.autofocus}
            autocomplete=${ifDefined(this.autocomplete as any)}
            type=${this.type === 'password' && this.passwordvisible
              ? 'text'
              : this.type}
            aria-describedby=${ifDefined(describedBy || undefined)}
            aria-invalid=${this.invalidmessage ? 'true' : 'false'}
            aria-errormessage=${ifDefined(
              this.invalidmessage ? this.validationId : undefined
            )}
            placeholder=${ifDefined(this.placeholder)}
            minlength=${ifDefined(this.minlength)}
            maxlength=${ifDefined(this.maxlength)}
            min=${ifDefined(this.min)}
            max=${ifDefined(this.max)}
            pattern=${ifDefined(this.pattern)}
            inputmode=${this.inputmode}
            @input=${this.handleInput}
            @change=${this.handleChange}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
            @keydown=${this.handleKeydown}
          />
          ${overlayFieldButtons
            ? html`
                <div class="field-buttons">
                  ${isClearIconVisible ? clearButton : nothing}
                  ${hasPasswordToggle ? passwordToggleButton : nothing}
                </div>
              `
            : nothing}
          ${!overlayFieldButtons && isClearIconVisible
            ? html`<span class="ds-field-affix">${clearButton}</span>`
            : nothing}
          ${!overlayFieldButtons && hasPasswordToggle
            ? html`<span class="ds-field-affix">${passwordToggleButton}</span>`
            : nothing}
          ${hasSuffix ? html`<span part="suffix" class="ds-field-affix"><slot name="suffix"></slot></span>` : html`<slot name="suffix"></slot>`}
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
      </ds-field>
    `;
  }
}
