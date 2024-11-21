import { css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html, literal } from 'lit/static-html.js';
import { styled } from 'mixins/tailwind.mixin.ts';
import './spinner.component';

const styles = [
  css`
    :host {
      width: auto;
    }

    .btn-loading {
      cursor: wait;
    }

    .btn-spinner-only {
      position: relative;
      gap: 0;
    }

    .btn-spinner-only mid-spinner {
      position: absolute;
      top: calc(50% - 0.5em);
      left: calc(50% - 0.5em);
    }
  `,
];

@customElement('mid-button')
export class MinidButton extends styled(LitElement, styles) {
  @query('.button')
  button!: HTMLButtonElement | HTMLLinkElement;

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

  /**
   * @ignore
   */
  get #isLink() {
    return !!this.href;
  }

  override render() {
    const tag = this.#isLink ? literal`a` : literal`button`;

    return html`<${tag}
      part="base"
      class="${classMap({
        button: true,
        'fds-focus': true,
        'fds-btn': true,
        'fds-btn--first': true,
        'fds-btn--full-width': this.fullwidth,
        'fds-btn--icon-only': this.iconstyled,
        'fds-btn--primary': this.variant === 'primary',
        'fds-btn--secondary': this.variant === 'secondary',
        'fds-btn--tertiary': this.variant === 'tertiary',
        'fds-btn--sm': this.size === 'sm',
        'fds-btn--md': this.size === 'md',
        'fds-btn--lg': this.size === 'lg',
        'btn-loading': this.loading,
        'btn-spinner-only': this.loading && !this.loadingtext,
      })}"
      type=${this.type}
      ?disabled=${this.disabled}
      href="${ifDefined(this.href)}"
    >
      <slot class="${classMap({
        invisible: this.loading && !this.loadingtext,
        hidden: this.loading && this.loadingtext,
      })}"></slot>
      <span class="${classMap({ hidden: !this.loading })}">${this.loadingtext}</span>
      ${this.loading ? html`<mid-spinner class="text-2xl" part="spinner"></mid-spinner>` : ''}
    </${tag}>`;
  }
}
