import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormControllerMixin } from '../mixins/form-controller.mixin.ts';
import './field.component.ts';
import inputStyles from '../styles/input-styles.ts';
import { styled } from '../mixins/tailwind.mixin.ts';
import { live } from 'lit/directives/live.js';

declare global {
  interface HTMLElementTagNameMap {
    'mid-checkbox': MinidCheckbox;
  }
}

const styles = inputStyles;

let nextUniqueId = 0;

/**
 * @event mid-change - Emitted when
 */
@customElement('mid-checkbox')
export class MinidCheckbox extends FormControllerMixin(
  styled(LitElement, styles)
) {
  private readonly descriptionId = `mid-checkbox-description-${++nextUniqueId}`;
  private readonly validationId = `mid-checkbox-validation-${nextUniqueId}`;
  private readonly inputId = `mid-checkbox-${nextUniqueId}`;

  @property()
  value = 'on';

  @property({ type: Boolean })
  checked = false;

  @property()
  name = '';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  readonly = false;

  @property({ type: String })
  size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Visually hides `label` and `description` (still available for screen readers)
   */
  @property({ type: Boolean })
  hidelabel = false;

  @property()
  validationmessage = '';

  @property({ type: Boolean })
  invalid = false;

  private handleChange(event: Event) {
    this.checked = (event.target as HTMLInputElement).checked;
    if (this.checked) {
      this.setFormValue(this.value, 'checked');
    } else {
      this.setFormValue(null);
    }
    this.dispatchEvent(
      new Event('mid-change', { bubbles: true, composed: true })
    );
  }

  private handleClick(event: Event) {
    if (this.readonly) {
      event.preventDefault();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.classList.add('ds-field');
  }

  override render() {
    return html`
      <div class="ds-field" part="field" data-size="${this.size}">
        <label
          for="${this.inputId}"
          class="${classMap({
            'ds-sr-only': this.hidelabel,
          })} ds-label block"
        >
          <slot></slot>
        </label>
        <p
          id=${this.descriptionId}
          class="${classMap({ 'ds-sr-only': this.hidelabel })}"
          data-field="description"
        >
          <slot name="description"></slot>
        </p>
        <input
          .value=${live(this.value)}
          name=${this.name}
          id="${this.inputId}"
          class="ds-input"
          type="checkbox"
          @change=${this.handleChange}
          @click=${this.handleClick}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          .checked=${live(this.checked)}
          aria-invalid=${this.invalid}
        />
        <p
          class="ds-validation-message"
          id="${this.validationId}"
          data-field="validation"
          aria-live="polite"
          ?hidden=${!this.validationmessage}
        >
          ${this.validationmessage}
        </p>
      </div>
    `;
  }
}
