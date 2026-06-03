import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { watch } from '../internal/watch.ts';
import { FormControlMixin } from '../mixins/form-control.mixin.ts';
import { styled } from '../mixins/tailwind.mixin.ts';
import { HasSlotController } from '../internal/slot.ts';
import './icon/icon.component.ts';
import {
  maxLengthValidator,
  minLengthValidator,
  patternValidator,
  requiredValidator,
} from '../mixins/validators.ts';
import { webOtpApiInit } from '../utilities/web-otp-api.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-code-input': MinidCodeInput;
  }
}

let nextUniqueId = 0;

const styles = [
  css`
    :host {
      display: block;
    }

    .code-input-label {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      margin-block-end: 0.5rem;
      font-weight: 500;
    }

    .code-input-label--hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .code-input-label--disabled,
    .input-wrapper--disabled {
      opacity: var(--ds-opacity-disabled, 0.38);
    }

    .input-wrapper {
      position: relative;
      cursor: text;
      width: fit-content;
      font-size: 1rem;
      line-height: 1.3;
      font-weight: 500;
    }

    .input-wrapper--sm {
      font-size: var(--ds-heading-sm-font-size, 1.125rem);
      line-height: var(--ds-heading-sm-line-height, 1.3);
      font-weight: var(--ds-heading-sm-font-weight, 500);
    }

    .input-wrapper--md {
      font-size: var(--ds-heading-md-font-size, 1.25rem);
      line-height: var(--ds-heading-md-line-height, 1.3);
      font-weight: var(--ds-heading-md-font-weight, 500);
    }

    .input-wrapper--lg {
      font-size: var(--ds-heading-lg-font-size, 1.5rem);
      line-height: var(--ds-heading-lg-line-height, 1.3);
      font-weight: var(--ds-heading-lg-font-weight, 500);
    }

    .input-wrapper--disabled {
      cursor: not-allowed;
    }

    .character-boxes {
      display: inline-flex;
      gap: var(--mid-code-input-gap, 0.5rem);
    }

    .character-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-sizing: border-box;
      width: var(--mid-code-input-box-size, var(--ds-size-13, 3.25rem));
      height: var(--mid-code-input-box-size, var(--ds-size-13, 3.25rem));
      padding-inline: 0.25rem;
      user-select: none;
      text-align: center;
      font-family:
        ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        'Liberation Mono', 'Courier New', monospace;
      line-height: 1;
      border: var(--ds-border-width-default, 1px) solid
        var(
          --mid-code-input-border-color,
          var(--ds-color-neutral-border-default, #717a84)
        );
      border-radius: var(
        --mid-code-input-border-radius,
        var(--ds-border-radius-md, 0.25rem)
      );
      background-color: var(
        --mid-code-input-background,
        var(--ds-color-neutral-background-default, #ffffff)
      );
      color: var(--mid-code-input-text-color, inherit);
    }

    .character-box--empty {
      color: var(
        --mid-code-input-placeholder-color,
        var(--ds-color-neutral-surface-active, #c7cacf)
      );
    }

    .character-box--empty::before {
      content: '';
      box-sizing: border-box;
      width: 0.55em;
      height: 0.55em;
      border: 2px solid currentColor;
      border-radius: 50%;
    }

    .character-box--invalid {
      border-width: 2px;
      border-color: var(
        --mid-code-input-danger-border-color,
        var(--ds-color-danger-border-default, #ce4d4d)
      );
      background-color: var(
        --mid-code-input-danger-background,
        var(--ds-color-danger-surface-tinted, #f8e4e4)
      );
    }

    .character-box--invalid.character-box--empty {
      color: var(
        --mid-code-input-danger-placeholder-color,
        var(--ds-color-danger-surface-active, #edbfbf)
      );
    }

    .focus-ring-sm {
      outline: 2px solid var(--ds-color-focus-outer, #1f2c3d);
      outline-offset: 2px;
      box-shadow: 0 0 0 2px var(--ds-color-focus-inner, #ffffff);
    }

    /* Ensure hidden attribute always hides elements even when Tailwind's
       @layer base [hidden] rule is not available in the shadow DOM */
    [hidden] {
      display: none !important;
    }

    .hidden-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      background: transparent;
      border: none;
      outline: none;
      color: transparent;
      caret-color: transparent;
      font-size: 16px; /* Minimum 16px prevents iOS zoom on focus */
      pointer-events: none;
      -webkit-appearance: none;
      appearance: none;
    }

    .hidden-input:focus {
      outline: none;
    }

    .hidden-input:disabled {
      cursor: not-allowed;
    }

    @keyframes blink {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
    }

    .character-box--caret::after {
      content: '';
      position: absolute;
      width: 2px;
      height: 60%;
      background-color: var(
        --color-accent-base,
        var(--ds-color-accent-base-default, blue)
      );
      animation: blink 1s step-end infinite;
    }

    /* Hide placeholder circle when the caret is at this position */
    .character-box--caret.character-box--empty {
      color: transparent;
    }

    /* Hide increment/decrement buttons on number inputs */
    input[type='number']::-webkit-outer-spin-button,
    input[type='number']::-webkit-inner-spin-button,
    input[type='number'] {
      -webkit-appearance: none;
      margin: 0;
      -moz-appearance: textfield !important;
    }

    .validation-message {
      display: flex;
      gap: 0.25rem;
      margin-block-start: 0.5rem;
      color: var(--ds-color-danger-text-subtle, #a22e2e);
    }

    .validation-icon {
      margin-block-start: 0.25rem;
      min-width: 1.25rem;
      min-height: 1.25rem;
    }
  `,
];

/**
 *
 * @event mid-change - Emitted when a change to the input value is comitted by the user
 * @event mid-input - Emitted when the input element recieves input
 * @event mid-complete - Emitted when all characters have been entered.
 * @event {detail: { validity: ValidityState }} mid-invalid-hide - Emitted when the error message should be hidden
 * @event {detail: { validity: ValidityState }} mid-invalid-show - Emitted when the error message should be shown
 *
 * @slot label - The input's label if you need to use HTML. Alternatively, you can use the `label` attribute.
 *
 * @csspart input-container - The wrapper around the input elements. This can be used to adjust font-size.
 * @csspart character-boxes - The container for the visual character boxes.
 * @csspart character-box - An individual character box.
 *
 * @method focus - Focuses the input element
 * @method clear - Clears the input
 */
@customElement('mid-code-input')
export class MinidCodeInput extends FormControlMixin(
  styled(LitElement, styles)
) {
  private readonly hasSlotControler = new HasSlotController(this, 'label');
  private readonly labelId = `mid-code-input-label-${nextUniqueId++}`;
  private readonly validationId = `mid-code-input-validation-${nextUniqueId++}`;

  @query('.hidden-input')
  private inputElement!: HTMLInputElement;

  @property({ reflect: true })
  value = '';

  @property()
  label = '';

  @property()
  type: 'number' | 'text' = 'text';

  /**
   * For displaying appropriate virtual keyboard
   */
  @property()
  inputmode: 'numeric' | 'text' = 'numeric';

  /**
   * Adjusts the font-size of the code inputs
   */
  @property()
  size: 'sm' | 'md' | 'lg' = 'sm';

  /**
   * Number of input characters or digits
   */
  @property({ type: Number })
  length = 5;

  @property({ type: Boolean })
  disabled = false;

  /**
   * Focuses the first input element on page load
   */
  @property({ type: Boolean })
  autofocus = false;

  /**
   *  The minimum length of input that will be considered valid.
   */
  @property({ type: Number })
  minlength?: number;

  /**
   * Error message to display when the input is invalid, also activates invalid styling
   */
  @property()
  invalidmessage = '';

  /**
   * Visually hides `label` (still available for screen readers)
   */
  @property({ type: Boolean })
  hidelabel = false;

  /**
   * Makes the input required
   */
  @property({ type: Boolean })
  required = false;

  /**
   * A regular expression pattern to validate input against.
   */
  @property()
  pattern?: string;

  @state()
  private isFocused = false;

  static get formControlValidators() {
    return [
      requiredValidator,
      maxLengthValidator,
      minLengthValidator,
      patternValidator,
    ];
  }

  get validationTarget() {
    return this.inputElement;
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    webOtpApiInit(this.renderRoot);
  }

  private handleBoxClick(index: number) {
    if (this.disabled) {
      return;
    }

    // Truncate the value to the clicked position
    this.value = this.value.substring(0, index);

    // Focus the input to move the caret
    this.focus();
  }

  private handleFocus() {
    this.isFocused = true;
    /* don't select text, move caret to the end */
    if (this.value.length > 0) {
      const length = this.value.length;
      this.inputElement.setSelectionRange(length, length);
    }
  }

  private handleBlur() {
    this.isFocused = false;
  }

  private handleBeforeInput(e: InputEvent) {
    if (e.inputType === 'insertText' && e.data) {
      if (this.type == 'number' && e.data.replace(/\D/g, '') == '') {
        e.preventDefault();
      }
    }
  }

  private handleInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.substring(0, this.length);

    if (input.value !== value) {
      input.value = value;
    }

    // Update the component's public `value` property if it has changed.
    if (this.value !== value) {
      this.value = value;
      this.setValue(value);
    }

    this.inputElement.dispatchEvent(
      new Event('mid-input', { bubbles: true, composed: true })
    );

    if (this.value.length === this.length && this.value.length > 0) {
      this.inputElement.dispatchEvent(
        new Event('mid-complete', { bubbles: true, composed: true })
      );
    }
  }

  private handleChange() {
    this.inputElement.dispatchEvent(
      new Event('mid-change', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleKeydown(event: KeyboardEvent) {
    const hasModifier =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    if (event.key === 'Enter' && !hasModifier) {
      // Pressing enter when focused on an input should submit the form like a native input, but we wait a tick before
      // submitting to allow users to cancel the keydown event if they need to
      setTimeout(() => {
        // When using an Input Method Editor (IME), pressing enter will cause the form to submit unexpectedly. One way
        // to check for this is to look at event.isComposing, which will be true when the IME is open.
        if (!event.defaultPrevented && !event.isComposing) {
          this.form?.requestSubmit();
        }
      });
    }
  }

  clear() {
    this.value = '';
    this.setValue('');
    this.invalidmessage = '';
  }

  resetFormControl() {
    this.clear();
  }

  focus(options?: FocusOptions): void {
    this.inputElement?.focus(options);
    /* don't select text, move caret to the end */
    if (this.value.length > 0) {
      const length = this.value.length;
      this.inputElement.setSelectionRange(length, length);
    }
  }

  @watch('length')
  handleLengthChange() {
    if (this.value.length > this.length) {
      this.value = this.value.substring(0, this.length);
    }
  }

  override render() {
    const hasLabelSlot = this.hasSlotControler.test('label');
    const hasLabel = !!this.label || !!hasLabelSlot;
    const describedBy = this.invalidmessage ? this.validationId : undefined;

    const chars = this.value.split('');
    const displayValues = Array.from(
      { length: this.length },
      (_, i) => chars[i] || ''
    );
    const isComplete = this.value.length >= this.length;
    const caretIndex =
      this.disabled || this.length === 0
        ? -1
        : Math.min(this.value.length, this.length - 1);

    return html`
      <label
        id="${this.labelId}"
        for="mid-code-input-hidden"
        class="code-input-label ${classMap({
          'code-input-label--hidden': this.hidelabel || !hasLabel,
          'code-input-label--disabled': this.disabled,
        })}"
      >
        <slot name="label"> ${this.label} </slot>
      </label>
      <div
        part="input-container"
        class="input-wrapper ${classMap({
          'input-wrapper--sm': this.size === 'sm',
          'input-wrapper--md': this.size === 'md',
          'input-wrapper--lg': this.size === 'lg',
          'input-wrapper--disabled': this.disabled,
        })}"
        @click=${() => this.focus()}
      >
        <div part="character-boxes" class="character-boxes" aria-hidden="true">
          ${displayValues.map((char, index) => {
            const isFocusTarget = this.isFocused && index === caretIndex;
            const hasCaret = isFocusTarget && !isComplete;
            return html`
              <div
                part="character-box"
                aria-hidden="true"
                class="character-box ${classMap({
                  'character-box--invalid': !!this.invalidmessage,
                  'character-box--caret': hasCaret,
                  'character-box--empty': !char,
                  'focus-ring-sm': isFocusTarget,
                })}"
                @click=${(e: MouseEvent) => {
                  e.stopPropagation();
                  this.handleBoxClick(index);
                }}
              >
                ${char}
              </div>
            `;
          })}
        </div>
        <input
          class="hidden-input"
          .value="${live(this.value)}"
          id="mid-code-input-hidden"
          type="${this.type}"
          aria-labelledby="${this.labelId}"
          aria-describedby=${ifDefined(describedBy)}
          aria-invalid=${this.invalidmessage ? 'true' : 'false'}
          aria-errormessage=${ifDefined(
            this.invalidmessage ? this.validationId : undefined
          )}
          maxlength="${this.length}"
          ?autofocus="${this.autofocus}"
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          pattern=${ifDefined(this.pattern)}
          inputmode="${this.inputmode}"
          autocomplete="one-time-code"
          @beforeinput="${this.handleBeforeInput}"
          @input="${this.handleInput}"
          @change="${this.handleChange}"
          @keydown="${this.handleKeydown}"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}"
        />
      </div>
      <div
        class="validation-message"
        id="${this.validationId}"
        aria-live="polite"
        ?hidden=${!this.invalidmessage}
      >
        <mid-icon name="xmark-octagon-fill" class="validation-icon"></mid-icon>
        ${this.invalidmessage}
      </div>
    `;
  }
}
