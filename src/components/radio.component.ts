import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { watch } from 'src/internal/watch';
import { styled } from 'src/mixins/tailwind.mixin';

const styles = [
  css`
    :host {
      --color-checked: #0062ba;
      color: white;
      padding: 0.25rem 0;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: 400;
    }

    :host > * {
      cursor: pointer;
    }

    :host:has(input:disabled),
    :host:has(input:disabled) > * {
      cursor: not-allowed;
    }

    :host:has(input:disabled) > * {
      opacity: 0.3;
    }

    .label {
      font-weight: 400;
    }

    .radio {
      -webkit-appearance: none;
      appearance: none;

      display: grid;
      place-content: center;
      transform: translateY(-0.075em);
    }

    .radio:checked {
      background: radial-gradient(
          circle closest-side,
          currentcolor 45%,
          transparent 50%
        ),
        var(--color-checked);
    }
  `,
];

@customElement('mid-radio')
export class MinidRadio extends styled(LitElement, styles) {
  /**
   * @ignore
   */
  @query('.radio')
  radio!: HTMLInputElement;

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
    this.setAttribute('role', 'radio');
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    this.setAttribute('tabindex', '-1');
    this.classList.add('rounded');
  }

  private handleBlur() {
    if (this.checked) {
      this.setAttribute('tabindex', '0');
    }
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
    this.radio.checked = this.checked;
  }

  /**
   * Sets focus on the radio button.
   */
  focus(options?: FocusOptions) {
    // Make host untabable to prevent double tabbing to get out
    if (this.checked) {
      this.setAttribute('tabindex', '-1');
    }
    this.classList.add('shadow-focus-visible');
    this.radio.focus(options);
  }

  override render() {
    return html`
      <input
        type="radio"
        name="${this.name}"
        class="${classMap({
          radio: true,
          'h-7': this.size === 'lg',
          'w-7': this.size === 'lg',
          'w-6': this.size === 'md',
          'h-6': this.size === 'md',
          'w-5': this.size === 'sm',
          'h-5': this.size === 'sm',
        })} appearance-none rounded-full border-2 border-border-neutral shadow-none checked:border-border-action"
        ?checked=${live(this.checked)}
        ?disabled=${this.disabled}
      />
      <label
        class="${classMap({
          label: true,
          'fds-label': true,
          'fds-label--sm': this.size === 'sm',
          'fds-label--md': this.size === 'md',
          'fds-label--lg': this.size === 'lg',
        })}"
      >
        <slot></slot>
      </label>
    `;
  }
}
