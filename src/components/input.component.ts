import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { styled } from '../mixins/tailwind.mixin';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import inputStyles from '../styles/input-styles';

const styles = [
  ...inputStyles,
  css`
    .ds-validation-message {
      margin-top: var(--dsc-field-content-spacing);
    }
  `,
];

let nextUniqueId = 0;

/**
 * @slot prefix - Used for decoration to the left of the input
 * @slot suffix - Used for decoration to the right of the input
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 *
 */
@customElement('mid-input')
export class MinidInput extends styled(LitElement, styles) {
  private readonly descriptionId = `mid-input-description-${++nextUniqueId}`;
  private readonly validationId = `mid-input-validation-${nextUniqueId}`;
  private readonly inputId = `mid-input-${nextUniqueId}`;

  @property()
  value = '';

  @property()
  label = '';

  @property()
  description = '';

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  @property()
  validationmessage = '';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  readonly = false;

  /**
   * Visually hides `label` and `description` (still available for screen readers)
   */
  @property({ type: Boolean })
  hidelabel = false;

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

  @property()
  placeholder?: string;

  @property()
  type:
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    /* | 'image' */
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    /* | "range" */
    /* | "reset" */
    | 'search'
    /* | "submit" */
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week' = 'text';

  override render() {
    return html`
      <div part="field" class="ds-field" data-size="${this.size}">
        <label
          for=${this.inputId}
          class="${classMap({
            'ds-sr-only': this.hidelabel,
          })} ds-label block"
        >
          <slot name="label">${this.label}</slot>
        </label>

        <p
          class="${classMap({ 'ds-sr-only': this.hidelabel })}"
          id="${this.descriptionId}"
          data-field="description"
        >
          <slot name="description"> ${this.description} </slot>
        </p>
        <input
          class="ds-input"
          part="input"
          id=${this.inputId}
          .value=${live(this.value)}
          aria-invalid=${this.validationmessage ? 'true' : 'false'}
          aria-describedby="${this.descriptionId} ${this.validationId}"
          type="${this.type}"
          ?readonly=${this.readonly}
          ?disabled=${this.disabled}
          autocomplete=${this.autocomplete as any}
          placeholder=${ifDefined(this.placeholder)}
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
