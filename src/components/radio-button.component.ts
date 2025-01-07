import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { watch } from 'src/internal/watch';
import { styled } from 'src/mixins/tailwind.mixin';

@customElement('mid-radio-button')
export class MinidRadioButton extends styled(LitElement) {
  /**
   * @ignore
   */
  @query('.button')
  button!: HTMLButtonElement;

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
  value: string | null = null;

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

  @watch('disabled', { waitUntilFirstUpdate: true })
  handleDisabledChange() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  /**
   * Sets focus on the radio button.
   */
  focus(options?: FocusOptions) {
    this.button.focus(options);
  }

  /**
   * Removes focus from the radio button.
   */
  blur() {
    this.button.blur();
  }

  override render() {
    return html`<button
      role="radio"
      type="button"
      value=${ifDefined(this.value ?? undefined)}
      class="${classMap({
        button: true,
        'whitespace-nowrap': true,
        'fds-togglegroup__item': true,
        'fds-btn': true,
        'fds-focus': true,
        'fds-btn--first': true,
        'fds-btn--full-width': true,
        'fds-btn--primary': this.checked,
        'fds-btn--tertiary': !this.checked,
        'fds-btn--sm': this.size === 'sm',
        'fds-btn--md': this.size === 'md',
        'fds-btn--lg': this.size === 'lg',
      })}"
      aria-checked=${this.checked}
      ?disabled=${this.disabled}
      @blur=${this.handleBlur}
      @focus=${this.handleFocus}
      @click=${this.handleClick}
    >
      <slot></slot>
    </button> `;
  }
}
