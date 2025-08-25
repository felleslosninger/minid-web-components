import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { watch } from '../internal/watch';
import { styled } from '../mixins/tailwind.mixin';
import { FormControlMixin } from '../mixins/form-control.mixin';

declare global {
  interface HTMLElementTagNameMap {
    'mid-radio': MinidRadio;
  }
}

const styles = [
  css`
    :host {
      display: inline-flex;
      cursor: pointer;
    }
  `,
];

/**
 *
 * @slot -- The radio's label
 *
 * @event mid-blur - Emitted when the control loses focus.
 * @event mid-focus - Emitted when the control gains focus.
 *
 * @csspart radio - Select the radio input element
 * @csspart label - Select the label element
 */
@customElement('mid-radio')
export class MinidRadio extends FormControlMixin(styled(LitElement, styles)) {
  @query('input[type="radio"]')
  element!: HTMLInputElement;

  @property()
  name = 'option';

  /**
   *  The radio button's checked state.
   */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /**
   * The radio's value. When selected, the radio group will receive this value.
   */
  @property()
  value = '';

  /**
   * Disables the radio button.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * The radio button's size. When used inside a radio group, the size will be determined by the radio group's size so
   * this attribute can typically be omitted.
   */
  @property({ reflect: true })
  size: 'sm' | 'md' | 'lg' = 'md';

  constructor() {
    super();
    this.addEventListener('blur', this.handleBlur);
    this.addEventListener('click', this.handleClick);
    this.addEventListener('focus', this.handleFocus);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'presentation');
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');

    this.classList.add('rounded');
  }

  private handleBlur() {
    this.classList.remove('shadow-focus-visible');
    this.dispatchEvent(
      new Event('mid-blur', { composed: true, bubbles: true })
    );
  }

  private handleFocus() {
    if (this.disabled) {
      return;
    }

    this.focus();
    this.dispatchEvent(
      new Event('mid-focus', { composed: true, bubbles: true })
    );
  }

  private handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.checked = true;
  }

  @watch('disabled', { waitUntilFirstUpdate: true })
  handleDisabledChange() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  @watch('checked', { waitUntilFirstUpdate: true })
  handleCheckChange() {
    this.element.checked = this.checked;
  }

  /**
   * Sets focus on the radio button.
   */
  focus(options?: FocusOptions) {
    // this.classList.add('shadow-focus-visible');
    this.element.focus(options);
  }

  override render() {
    return html`
      <input
        type="radio"
        part="radio"
        name="${this.name}"
        class="${classMap({
          'h-7': this.size === 'lg',
          'w-7': this.size === 'lg',
          'w-6': this.size === 'md',
          'h-6': this.size === 'md',
          'w-5': this.size === 'sm',
          'h-5': this.size === 'sm',
        })} focus-visible:focus-ring-sm rounded-full shadow-none"
        ?checked=${live(this.checked)}
        ?disabled=${this.disabled}
      />
      <label part="label" class="${classMap({})} pl-2">
        <slot></slot>
      </label>
    `;
  }
}
