import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { stringConverter } from 'internal/string-converter';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from 'mixins/tailwind.mixin.ts';
import { FormControllerMixin } from 'mixins/form-controller.mixin.ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import { HasSlotController } from 'src/internal/slot';

const styles = [
  css`
    :host {
      display: block;
    }

    .form-control {
      display: block;
    }

    .form-control:has(input:disabled) {
      opacity: 0.3;
    }

    .fds-label {
      margin-bottom: 0.5rem;
    }

    .field {
      padding: 0;
    }

    .input {
      width: 100%;
      outline: none;
      box-shadow: none;
      background-color: transparent;
      padding: 0 1rem;
    }

    .field:has(.input:disabled) {
      opacity: var(--fds-opacity-disabled);
    }

    .suffix,
    .prefix {
      display: flex;
      place-items: center;
    }

    .suffix ::slotted(*) {
      margin-inline-end: 1rem !important; // global style for button is margin: 0
      border-radius: 4px;
    }

    .prefix ::slotted(*) {
      margin-inline-start: 1rem !important; // global style for button is margin: 0
      border-radius: 4px;
    }

    .clear-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(1em + 1rem * 2);
      border-radius: 4px;
    }

    .fds-textfield__readonly__icon svg {
      font-size: 1.2em;
    }

    .clear-button:not(:disabled, [aria-disabled]):hover mid-icon {
      border-radius: 4px;
      background: var(--fds-semantic-surface-action-subtle-hover);
    }

    .clear-button--sm {
      font-size: 20px;
    }

    .clear-button--md {
      font-size: 24px;
    }
    .clear-button--lg {
      font-size: 28px;
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

/**
 *
 * @event mid-change - Emitted when a change to the input value is comitted by the user
 * @event mid-input - Emitted when the input element recieves input
 * @event mid-clear - Emitted when the input value is cleared
 * @event mid-focus - Emitted when input element is focused
 * @event mid-blur - Emitted when focus moves away from input element
 *
 * @slot prefix - Used for decoration to the left of the input
 * @slot suffix - Used for decoration to the right of the input
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 *
 * @csspart base - The fields's base wrapper.
 * @csspart input - The internal `<input>` element.
 * @csspart form-control - The form control that wraps the label, input, and help text.
 * @csspart clear-button - The clear button
 * @csspart password-toggle-button - The button for toggling password visibility
 */
@customElement('mid-textfield')
export class MinidTextfield extends FormControllerMixin(
  styled(LitElement, styles)
) {
  private readonly hasSlotControler = new HasSlotController(this, 'label');

  @query('.input')
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
   * Activate error styling on the input element
   */
  @property({ type: Boolean })
  invalid = false;

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
   * Adds a clear button when the input is not empty.
   * */
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
   * Visually hides `label` and `description` (still available for screen readers)
   */
  @property({ type: Boolean })
  hidelabel = false;

  @state()
  hasFocus = false;

  private handleKeydown(event: KeyboardEvent) {
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
          this.internals.form?.requestSubmit();
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
    this.value = this.input.value;
    this.dispatchEvent(
      new Event('mid-input', { bubbles: true, composed: true })
    );
    this.setFormValue(this.value);
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
    this.input.focus();
  }

  override render() {
    const lg = this.size === 'lg';
    const md = this.size === 'md';
    const sm = this.size === 'sm';

    const hasLabelSlot = this.hasSlotControler.test('label');
    const hasLabel = !!this.label || !!hasLabelSlot;
    const hasClearIcon = this.clearable && !this.disabled && !this.readonly;
    const isClearIconVisible =
      hasClearIcon && (typeof this.value === 'number' || this.value.length > 0);

    return html`
      <div
        part="form-control"
        class="${classMap({
          'form-control': true,
          'fds-paragraph': true,
          'fds-textfield': true,
          'fds-textfield--error': this.invalid,
          'fds-textfield--readonly': this.readonly,
          'fds-paragraph--sm': sm,
          'fds-paragraph--md': md,
          'fds-paragraph--lg': lg,
          'fds-textfield--sm': sm,
          'fds-textfield--md': md,
          'fds-textfield--lg': lg,
        })}"
      >
        <label
          for="input"
          class="${classMap({
            'sr-only': this.hidelabel || !hasLabel,
            'fds-label': true,
            'fds-label--medium-weight': true,
            'fds-textfield__label': true,
            'fds-label--sm': sm,
            'fds-label--md': md,
            'fds-label--lg': lg,
          })}"
        >
          ${!this.readonly
            ? nothing
            : html`<mid-icon
                class="fds-textfield__readonly__icon"
                library="system"
                name="padlock-locked-fill"
              ></mid-icon>`}
          <slot name="label"> ${this.label} </slot>
        </label>
        ${!this.description
          ? nothing
          : html`
              <div
                id="description"
                part="description"
                class="${classMap({
                  description: true,
                  'fds-paragraph': true,
                  'sr-only': this.hidelabel,
                  'fds-paragraph--sm': sm,
                  'fds-paragraph--md': md,
                  'fds-paragraph--lg': lg,
                  'fds-textfield__description': true,
                })}"
              >
                ${this.description}
              </div>
            `}
        <div
          part="base"
          class="${classMap({
            field: true,
            'fds-textfield__field': true,
            'fds-textfield__input': true,
            'fds-focus': this.hasFocus,
          })}"
        >
          <span class="prefix">
            <slot name="prefix"></slot>
          </span>
          <input
            id="input"
            class="input"
            part="input"
            .value=${live(this.value)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?autofocus=${this.autofocus}
            type=${this.type === 'password' && this.passwordvisible
              ? 'text'
              : this.type}
            aria-describedby="description"
            placeholder=${ifDefined(this.placeholder)}
            minlength=${ifDefined(this.minlength)}
            maxlength=${ifDefined(this.maxlength)}
            min=${ifDefined(this.min)}
            max=${ifDefined(this.max)}
            @input=${this.handleInput}
            @change=${this.handleChange}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
            @keydown=${this.handleKeydown}
          />
          ${isClearIconVisible
            ? html`
                <button
                  part="clear-button"
                  class="${classMap({
                    'clear-button': true,
                    'clear-button--sm': sm,
                    'clear-button--md': md,
                    'clear-button--lg': lg,
                  })}"
                  type="button"
                  aria-label="Tøm"
                  @click=${this.handleClearClick}
                >
                  <mid-icon name="xmark" library="system"></mid-icon>
                </button>
              `
            : ''}
          ${this.passwordtoggle && !this.disabled
            ? html`
                <button
                  part="password-toggle-button"
                  class="${classMap({
                    'clear-button': true,
                    'clear-button--sm': sm,
                    'clear-button--md': md,
                    'clear-button--lg': lg,
                  })}"
                  type="button"
                  aria-label=${this.passwordvisible
                    ? 'skjul passord'
                    : 'vis passord'}
                  @click=${this.handlePasswordToggle}
                  tabindex="-1"
                >
                  ${this.passwordvisible
                    ? html`
                        <mid-icon name="eye-slash" library="system"></mid-icon>
                      `
                    : html` <mid-icon name="eye" library="system"></mid-icon> `}
                </button>
              `
            : ''}
          <span part="suffix" class="suffix">
            <slot name="suffix"></slot>
          </span>
        </div>
      </div>
    `;
  }
}
