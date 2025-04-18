import { html, literal } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin';
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
      'mb-2': this.spacing,
      'text-heading-2xs': this.size === '2xs',
      'text-heading-xs': this.size === 'xs',
      'text-heading-sm': this.size === 'sm',
      'text-heading-md': this.size === 'md',
      'text-heading-lg': this.size === 'lg',
      'text-heading-xl': this.size === 'xl',
      'text-heading-2xl': this.size === '2xl',
    })}"><slot></slot></${tag}>`;
  }
}
