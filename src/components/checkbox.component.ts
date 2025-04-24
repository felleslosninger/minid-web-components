import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from '../mixins/tailwind.mixin';
import { FormControllerMixin } from '../mixins/form-controller.mixin.ts';
import './icon/icon.component.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-checkbox': MinidCheckbox;
  }
}

/**
 *
 */

@customElement('mid-checkbox')
export class MinidCheckbox extends FormControllerMixin(styled(LitElement)) {
  @query('input[type="checkbox"]')
  input!: HTMLInputElement;

  /**
   * The name of the checkbox, submitted as a name/value pair with form data.
   */
  @property()
  name = '';

  /**
   * The current value of the checkbox, submitted as a name/value pair with form data.
   */
  @property()
  value?: string;

  @property({ type: Boolean })
  checked = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  readonly = false;

  @property({ type: Boolean })
  invalid = false;

  @property({ type: Boolean })
  required = false;

  private handleChange(event: Event) {
    this.checked = (event.target as HTMLInputElement).checked;
    if (this.checked) {
      this.setFormValue('on', 'checked');
    } else {
      this.setFormValue(null);
    }
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  private handleClick(event: Event) {
    if (this.readonly) {
      event.preventDefault();
    }
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

  /**
   *  Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid.
   */
  checkValidity() {
    return this.input.checkValidity();
  }

  /**
   *  Checks for validity and shows the browser's validation message if the control is invalid.
   */
  reportValidity() {
    return this.input.reportValidity();
  }

  /**
   * Sets a custom validation message. The value provided will be shown to the user when the form is submitted. To clear
   * the custom validation message, call this method with an empty string.
   */
  setCustomValidity(message: string) {
    this.input.setCustomValidity(message);
  }

  override render() {
    return html`
      <label
        class="${classMap({
          'opacity-disabled': this.disabled,
          'cursor-not-allowed': this.disabled,
        })} grid grid-cols-[auto_1fr] gap-2"
      >
        <span
          class="${classMap({
            'bg-accent-base': !this.readonly && this.checked && !this.invalid,
            'bg-danger-base': !this.readonly && this.checked && this.invalid,
            'border-accent-base':
              !this.readonly && this.checked && !this.invalid,
            'border-neutral': !this.readonly && !this.checked && !this.invalid,
            'border-danger-base': !this.readonly && this.invalid,
            'border-neutral-subtle': this.readonly,
            'bg-neutral-surface-tinted': this.readonly,
          })} inline-flex size-6 shrink-0 items-center justify-center rounded-sm border"
        >
          <input
            class="pointer-events-none appearance-none"
            type="checkbox"
            @change=${this.handleChange}
            @click=${this.handleClick}
            ?disabled=${this.disabled}
            ?checked=${this.checked}
            ?readonly=${this.readonly}
            ?required=${this.required}
          />
          ${this.checked
            ? html`<mid-icon
                class="${classMap({
                  'text-accent-base-contrast': this.checked && !this.readonly,
                })} size-6 shrink-0 scale-125"
                name="checkmark"
              ></mid-icon>`
            : ''}
        </span>
        <div part="label">
          <slot></slot>
        </div>
      </label>
    `;
  }
}
