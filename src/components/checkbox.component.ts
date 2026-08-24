import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { styled } from '../mixins/tailwind.mixin';
import './icon/icon.component.ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormControlMixin } from '../mixins/form-control.mixin.ts';
import { watch } from '../internal/watch.ts';
import { requiredValidator } from '../mixins/validators.ts';
import { HasSlotController } from '../internal/slot.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-checkbox': MinidCheckbox;
  }
}

const styles = [
  css`
    .description {
      color: var(--ds-color-neutral-text-subtle);
    }
  `,
];

/**
 * @slot -- The default slot for the label text of the checkbox
 * @slot description - The slot for the description text of the checkbox
 *
 * @csspart label - The checkbox's label.
 * @csspart description - The checkbox's description.
 * @csspart validation-message - The error message shown by `invalidmessage`.
 *
 * @event mid-change - Emitted when the checked state changes
 */

@customElement('mid-checkbox')
export class MinidCheckbox extends FormControlMixin(
  styled(LitElement, styles)
) {
  @query('input[type="checkbox"]')
  private input!: HTMLInputElement;

  private readonly hasSlotController = new HasSlotController(
    this,
    'description'
  );

  private readonly descriptionId = 'description';
  private readonly validationId = 'validation';

  /**
   * The name of the checkbox, submitted as a name/value pair with form data.
   */
  @property()
  name = '';

  /**
   * The current value of the checkbox, submitted as a name/value pair with form data.
   */
  @property()
  value = 'on';

  @property({ type: Boolean })
  checked = false;

  @property()
  description?: string;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  readonly = false;

  @property({ type: Boolean })
  invalid = false;

  @property()
  invalidmessage = '';

  @property({ type: Boolean, reflect: true })
  required = false;

  static get formControlValidators() {
    return [requiredValidator];
  }

  shouldFormValueUpdate(): boolean {
    return this.checked;
  }

  get validationTarget() {
    return this.input;
  }

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
          this.form.requestSubmit();
        }
      });
    }
  }

  private handleClick() {
    this.checked = !this.checked;
    // this.indeterminate = false;
    this.dispatchEvent(new Event('mid-change'));
  }

  /**
   * Simulates a click on the checkbox.
   */
  click() {
    this.input.click();
  }

  /**
   * Sets focus on the checkbox.
   */
  focus(options?: FocusOptions) {
    this.input.focus(options);
  }

  /**
   * Removes focus from the checkbox.
   */
  blur() {
    this.input.blur();
  }

  @watch(['checked', 'value'])
  handleStateChange() {
    // this.input.indeterminate = this.indeterminate; // force a sync update
    this.setValue(this.value);
  }

  override render() {
    const hasDescription =
      !!this.description || this.hasSlotController.test('description');
    const isInvalid = this.invalid || !!this.invalidmessage;
    const describedBy =
      [
        hasDescription ? this.descriptionId : undefined,
        this.invalidmessage ? this.validationId : undefined,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    // The description wrapper is aria-hidden. It is already announced through
    // the aria-describedby above, and without this the text is also reachable as
    // its own node when navigating the page, so it is read out twice.

    return html`
      <ds-field class="ds-field">
      <input
      id="input"
      class="ds-input"
      type="checkbox"
      value=${ifDefined(this.value)}
      .checked=${live(this.checked)}
          ?disabled=${this.disabled}
          ?checked=${this.checked}
          ?readonly=${this.readonly}
          ?required=${this.required}
          aria-invalid=${isInvalid ? 'true' : 'false'}
          aria-describedby=${ifDefined(describedBy)}
          aria-errormessage=${ifDefined(
            this.invalidmessage ? this.validationId : undefined
          )}
          @click=${this.handleClick}
          @keydown=${this.handleKeydown}
          />
        <label
          class="ds-label"
          part="label"
          for="input"
        >
          <slot></slot>
        </label>
        <div
          class="description"
          id="${this.descriptionId}"
          aria-hidden="true"
        >
          <slot
            name="description"
            part="description"
          >
            ${this.description}
          </slot>
        </div>
        <p
          class="${classMap({
            'ds-validation-message': !!this.invalidmessage,
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
