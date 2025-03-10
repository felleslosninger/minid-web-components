import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '@digdir/designsystemet-css/input.css?inline';
import fieldStyles from '@digdir/designsystemet-css/field.css?inline';
import labelStyles from '@digdir/designsystemet-css/label.css?inline';
import validationStyles from '@digdir/designsystemet-css/validation-message.css?inline';
import { live } from 'lit/directives/live.js';
import { styled } from '../mixins/tailwind.mixin';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

const styles = [
  inputStyles,
  fieldStyles,
  labelStyles,
  validationStyles,
  css`
    .ds-validation-message {
      margin-top: var(--dsc-field-content-spacing);
    }
  `,
];

let nextUniqueId = 0;

@customElement('mid-input')
export class MinidInput extends styled(LitElement, styles) {
  #labelId = `mid-input-label-${++nextUniqueId}`;
  #descriptionId = `mid-input-description-${nextUniqueId}`;
  #validationId = `mid-input-validation-${nextUniqueId}`;
  #inputId = `mid-input-${nextUniqueId}`;

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
      <div slot="field" class="ds-field" data-size="${this.size}">
        <label
          id=${this.#labelId}
          for=${this.#inputId}
          class="ds-label ${classMap({
            'ds-sr-only': this.hidelabel,
          })}"
        >
          <slot name="label"> ${this.label} </slot>
        </label>

        <div id="${this.#descriptionId}" data-field="description">
          <slot name="description"> ${this.description} </slot>
        </div>
        <input
          class="ds-input"
          part="input"
          id=${this.#inputId}
          .value=${live(this.value)}
          aria-invalid=${this.validationmessage ? 'true' : 'false'}
          aria-describedby="${this.#descriptionId} ${this.#validationId}"
          type="${this.type}"
          ?readonly=${this.readonly}
          ?disabled=${this.disabled}
          autocomplete=${this.autocomplete as any}
          placeholder=${ifDefined(this.placeholder)}
        />
        <p
          class="ds-validation-message"
          id="${this.#validationId}"
          data-field="validation"
          aria-live="polite"
          ?hidden=${!this.validationmessage}
        >
          Her har det skjedd en feil
        </p>
      </div>
    `;
  }
}
