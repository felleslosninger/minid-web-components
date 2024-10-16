import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html, literal } from 'lit/static-html.js';
import { styled } from 'mixins/tailwind.mixin.ts';

const styles = [
  css`
    :host {
      display: flex;
    }
  `,
];

@customElement('mid-button')
export class MinidButton extends styled(LitElement, styles) {
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
  @property({ type: Boolean, attribute: 'full-width' })
  fullWidth = false;

  /**
   * Whether the button is disabled
   */
  @property({ type: Boolean })
  disabled = false;

  private get isLink() {
    return !!this.href;
  }

  override render() {
    const tag = this.isLink ? literal`a` : literal`button`;

    return html`<${tag}
      part="base"
      class="${classMap({
        'fds-focus': true,
        'fds-btn': true,
        'fds-btn--first': true,
        'fds-btn--full-width': this.fullWidth,
        'fds-btn--primary': this.variant === 'primary',
        'fds-btn--secondary': this.variant === 'secondary',
        'fds-btn--tertiary': this.variant === 'tertiary',
        'fds-btn--sm': this.size === 'sm',
        'fds-btn--md': this.size === 'md',
        'fds-btn--lg': this.size === 'lg',
      })}"
      type=${this.type}
      ?disabled=${this.disabled}
      href="${ifDefined(this.href)}"
    >
      <slot></slot>
    </${tag}>`;
  }
}
