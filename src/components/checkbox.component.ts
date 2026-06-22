import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { styled } from '../mixins/tailwind.mixin';
import './icon/icon.component.ts';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormControlMixin } from '../mixins/form-control.mixin.ts';
import { watch } from '../internal/watch.ts';
import { requiredValidator } from '../mixins/validators.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-checkbox': MinidCheckbox;
  }
}

/**
 * @slot -- The default slot for the label text of the checkbox
 * @slot description - The slot for the description text of the checkbox
 *
 * @event mid-change - Emitted when the checked state changes
 */

@customElement('mid-checkbox')
export class MinidCheckbox extends FormControlMixin(styled(LitElement)) {
  @query('input[type="checkbox"]')
  private input!: HTMLInputElement;

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
        <div data-field="description">
          <slot
            name="description"
            part="description"
          >
            ${this.description}
          </slot>
        </div>
      </ds-field>
    `;
  }
}
