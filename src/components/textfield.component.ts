import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { stringConverter } from 'internal/string-converter';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from 'mixins/tailwind.mixin.ts';

const styles = [
  css`
    :host {
      display: flex;
    }

    .field {
      padding: 0;
    }

    .input {
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
      margin-inline-end: 1rem;
    }

    .prefix ::slotted(*) {
      margin-inline-start: 1rem;
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
 *
 * @slot prefix - Used to place icons or text to the left of the input
 * @slot suffix - Used to place icons or text to the right of the input
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
@customElement('mid-textfield')
export class MinidTextfield extends styled(LitElement, styles) {
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

  @property({ attribute: true, converter: stringConverter })
  placeholder = '';

  @property()
  type: 'text' | 'number' = 'text';

  @property({ type: Boolean })
  disabled = false;

  private handleInput() {
    this.value = this.input.value;
  }

  override render() {
    const lg = this.size === 'lg';
    const md = this.size === 'md';
    const sm = this.size === 'sm';

    return html`
      <div
        class="${classMap({
          'form-control': true,
          'fds-paragraph': true,
          'fds-textfield': true,
          'fds-paragraph--sm': sm,
          'fds-paragraph--md': md,
          'fds-paragraph--lg': lg,
          'fds-textfield--sm': sm,
          'fds-textfield--md': md,
          'fds-textfield--lg': lg,
        })}"
      >
        <label
          class="${classMap({
            'fds-label': true,
            'fds-label--medium-weight': true,
            'fds-textfield__label': true,
            'fds-label--sm': sm,
            'fds-label--md': md,
            'fds-label--lg': lg,
          })}"
        >
          ${this.label}
        </label>
        <div
          part="description"
          id="description"
          class="${classMap({
            description: true,
            'fds-paragraph': true,
            'fds-paragraph--sm': sm,
            'fds-paragraph--md': md,
            'fds-paragraph--lg': lg,
            'fds-textfield__description': true,
          })}"
        >
          <slot name="description">${this.description}</slot>
        </div>
        <div class="field fds-textfield__field fds-textfield__input fds-focus">
          <span class="prefix">
            <slot name="prefix"></slot>
          </span>
          <input
            class="input"
            value=${live(this.value)}
            ?disabled=${this.disabled}
            type=${this.type}
            placeholder=${this.placeholder}
            @input=${this.handleInput}
          />
          <span class="suffix">
            <slot name="suffix"></slot>
          </span>
        </div>
      </div>
    `;
  }
}
