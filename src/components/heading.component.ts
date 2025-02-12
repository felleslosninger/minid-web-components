import { html, literal } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import { styled } from 'src/mixins/tailwind.mixin';
import { classMap } from 'lit/directives/class-map.js';
import { LitElement } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'mid-heading': MinidHeading;
  }
}

@customElement('mid-heading')
export class MinidHeading extends styled(LitElement) {
  /**
   * @default 1
   */
  @property({ type: Number })
  level: 1 | 2 | 3 | 4 | 5 | 6 = 1;

  /**
   * @default 'md'
   */
  @property()
  size: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';

  /**
   *
   * @default false
   */
  @property({ type: Boolean })
  spacing = false;

  override render() {
    const tag =
      this.level === 1
        ? literal`h1`
        : this.level === 2
          ? literal`h2`
          : this.level === 3
            ? literal`h3`
            : this.level === 4
              ? literal`h4`
              : this.level === 5
                ? literal`h5`
                : literal`h6`;

    return html`<${tag} class="${classMap({
      'fds-heading': true,
      'fds-heading--spacing': this.spacing,
      'fds-heading--2xs': this.size === '2xs',
      'fds-heading--xs': this.size === 'xs',
      'fds-heading--sm': this.size === 'sm',
      'fds-heading--md': this.size === 'md',
      'fds-heading--lg': this.size === 'lg',
      'fds-heading--xl': this.size === 'xl',
      'fds-heading--2xl': this.size === '2xl',
    })}" ><slot></slot></${tag}>`;
  }
}
