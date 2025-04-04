import { css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html, literal } from 'lit/static-html.js';
import { styled } from '../mixins/tailwind.mixin.ts';
import { FormControllerMixin } from '../mixins/form-controller.mixin.ts';
import dsStyles from '@digdir/designsystemet-css/button.css?inline';
import './spinner.component.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-button': MinidButton;
  }
}

const styles = [
  dsStyles,
  css`
    :host {
      width: auto;
    }

    .spinner-only {
      position: relative;
      gap: 0;
    }

    .spinner-only mid-spinner {
      position: absolute;
    }

    .invisible {
      visibility: hidden;
    }

    .hidden {
      display: none;
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
   * The size of the button.
   */
  @property({ type: String })
  size?: 'md' | 'lg' | 'sm';

  /**
   * The type of the button.
   */
  @property({ type: String })
  type: 'submit' | 'button' | 'reset' = 'button';

  /**
   * The href of the button. If set, the button will be rendered as an anchor tag
   */
  @property({ type: String })
  href: string | undefined;

  /**
   * Whether the button should be full width
   */
  @property({ type: Boolean })
  fullwidth = false;

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
  get #isLink() {
    return !!this.href;
  }

  focus() {
    this.button.focus();
  }

  override render() {
    const tag = this.#isLink ? literal`a` : literal`button`;

    return html`<${tag}
      part="base"
      class="${classMap({
        'ds-button': true,
        'spinner-only': this.loading && !this.loadingtext,
      })}"
      href="${ifDefined(this.href)}"
      type=${this.type}
      ?disabled=${this.disabled}
      ?data-fullwidth=${this.fullwidth}
      ?data-icon=${this.iconstyled}
      data-variant=${ifDefined(this.variant)}
      data-size=${ifDefined(this.size)}
      aria-busy=${this.loading}
      aria-disabled=${this.loading}
    >
      <slot
        class="${classMap({
          invisible: this.loading && !this.loadingtext,
          hidden: this.loading && this.loadingtext,
        })}"
      ></slot>
      <span class="${classMap({ hidden: !this.loading })}"
        >${this.loadingtext}</span
      >
      ${
        this.loading
          ? html`<mid-spinner
              class="ds-spinner"
              data-size="sm"
              part="spinner"
            ></mid-spinner>`
          : ''
      }
    </${tag}>`;
  }
}
