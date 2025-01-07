import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { watch } from 'src/internal/watch';
import { styled } from 'src/mixins/tailwind.mixin';

const styles = [
  css`
    :host {
      padding: 4px 0;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 4px;
    }

    :host:not(:disabled) {
      background-color: hotpink;
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
    // this.addEventListener('blur', this.handleBlur);
    // this.addEventListener('click', this.handleClick);
    // this.addEventListener('focus', this.handleFocus);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setInitialAttributes();
  }

  private handleBlur() {
    this.dispatchEvent(
      new Event('mid-blur', { composed: true, bubbles: true })
    );
  }

  private handleFocus() {
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

  private setInitialAttributes() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    this.classList.add('rounded');
  }

  @watch('disabled', { waitUntilFirstUpdate: true })
  handleDisabledChange() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  /**
   * Sets focus on the radio button.
   */
  focus(options?: FocusOptions) {
    this.classList.add('shadow-focus-visible');
    this.radio.focus(options);
  }

  /**
   * Removes focus from the radio button.
   */
  blur() {
    this.classList.remove('shadow-focus-visible');
    this.radio.blur();
  }

  override render() {
    console.log(this.value, 'checked: ', this.checked);

    return html`
      <input
        type="radio"
        name="${this.name}"
        class="${classMap({
          radio: true,
          'cursor-pointer': true,
          'h-7': this.size === 'lg',
          'w-7': this.size === 'lg',
          'w-6': this.size === 'md',
          'h-6': this.size === 'md',
          'w-5': this.size === 'sm',
          'h-5': this.size === 'sm',
          // 'whitespace-nowrap': true,
          // 'fds-togglegroup__item': true,
          // 'fds-btn': true,
          // 'fds-focus': true,
          // 'fds-btn--first': true,
          // 'fds-btn--full-width': true,
          // 'fds-btn--primary': this.checked,
          // 'fds-btn--tertiary': !this.checked,
          // 'fds-btn--sm': this.size === 'sm',
          // 'fds-btn--md': this.size === 'md',
          // 'fds-btn--lg': this.size === 'lg',
        })} shadow-none"
        ?checked=${this.checked}
        ?disabled=${this.disabled}
        @blur=${this.blur}
      />
      <label
        @click=${this.handleClick}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        class="${classMap({
          'fds-label': true,
          'fds-label--sm': this.size === 'sm',
          'fds-label--md': this.size === 'md',
          'fds-label--lg': this.size === 'lg',
        })} cursor-pointer"
      >
        <slot></slot>
      </label>
    `;
  }
}
