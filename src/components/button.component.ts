import { css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html, literal } from 'lit/static-html.js';
import { styled } from '../mixins/tailwind.mixin.ts';
import { FormControllerMixin } from '../mixins/form-controller.mixin.ts';
import './spinner.component.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-button': MinidButton;
  }
}

const styles = [
  css`
    :host {
      display: inline-flex;
    }
  `,
];

/**
 * A regular old button
 */
@customElement('mid-button')
export class MinidButton extends FormControllerMixin(
  styled(LitElement, styles)
) {
  @query('.button')
  button!: HTMLButtonElement | HTMLLinkElement;

  /**
   * The value of the button (optional)
   */
  @property({ type: String })
  value = '';

  /**
   * The variant of the button
   */
  @property({ type: String })
  variant: 'primary' | 'secondary' | 'tertiary' = 'primary';

  /**
   * The size of the button. Defaults to 'md'
   */
  @property({ type: String })
  size: 'md' | 'lg' | 'sm' = 'md';

  /**
   * The type of the button. Defaults to normal 'button'
   */
  @property({ type: String })
  type: 'submit' | 'button' | 'reset' = 'button';

  /**
   * The href of the button. If set, the button will be rendered as an anchor tag
   */
  @property({ type: String })
  href: string | undefined;

  /**
   * Whether the button is disabled
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   *
   */
  @property({ type: Boolean })
  loading = false;

  @property()
  loadingtext = '';

  /**
   * Toggle icon only styling
   */
  @property({ type: Boolean })
  iconstyled = false;

  constructor() {
    super();
    this.addEventListener('click', this.handleClick);
  }

  handleClick() {
    if (this.type === 'submit') {
      this.value && this.setFormValue(this.value);
      this.internals.form!.requestSubmit();
    } else if (this.type === 'reset') {
      this.internals.form!.reset();
    }
  }

  /**
   * @ignore
   */
  get isLink() {
    return !!this.href;
  }

  focus() {
    this.button.focus();
  }

  override render() {
    const tag = this.isLink ? literal`a` : literal`button`;
    const primary = this.variant === 'primary';
    const secondary = this.variant === 'secondary';
    const tertiary = this.variant === 'tertiary';
    const sm = this.size === 'sm';
    const md = this.size === 'md';
    const lg = this.size === 'lg';
    const spinnerOnly = this.loading && !this.loadingtext;

    return html`<${tag}
      part="base"
      class="${classMap({
        'w-12': this.iconstyled,
        'h-12': this.iconstyled,
        'py-2': !this.iconstyled,
        'px-4': !this.iconstyled,
        'bg-accent-base': primary,
        'text-accent-base-contrast': primary,
        'border-transparent': primary || tertiary,
        'hover:bg-accent-base-hover': primary,
        'active:bg-accent-base-active': primary,
        'bg-transparent': secondary || tertiary,
        'active:bg-accent-surface-active': secondary || tertiary,
        'hover:bg-accent-surface-hover': secondary || tertiary,
        'text-accent-subtle': secondary || tertiary,
        'hover:text-accent': secondary || tertiary,
        'border-accent-strong': secondary,
        'fds-btn--secondary': secondary,
        'fds-btn--tertiary': tertiary,
        'text-body-sm': sm,
        'text-body-md': md,
        'text-body-lg': lg,
        'cursor-wait': this.loading && !this.disabled,
        'cursor-pointer': !this.loading && !this.disabled,
        'cursor-not-allowed': this.disabled,
        relative: spinnerOnly,
        'gap-0': spinnerOnly,
        'opacity-disabled': this.disabled && !this.loading,
      })} grow focus-visible:focus-ring leading-sm flex h-fit min-h-12 min-w-12 items-center justify-center gap-2 rounded border font-medium"
      type=${this.type}
      aria-busy=${this.loading}
      ?disabled=${this.disabled}
      href="${ifDefined(this.href)}"
    >
      <slot
        class="${classMap({
          invisible: spinnerOnly,
          hidden: this.loading && this.loadingtext,
        })}"
      ></slot>
      <span class="${classMap({ hidden: !this.loading || !this.loadingtext })}">
        ${this.loadingtext}
      </span>
      ${
        this.loading
          ? html`<mid-spinner
              class="${classMap({
                'text-[1.4rem]': true,
                absolute: spinnerOnly,
                'top-[calc(50%_-_0.5em)]': spinnerOnly,
                'left-[calc(50%_-_0.5em)]': spinnerOnly,
              })}"
              part="spinner"
            ></mid-spinner>`
          : ''
      }
    </${tag}>`;
  }
}
