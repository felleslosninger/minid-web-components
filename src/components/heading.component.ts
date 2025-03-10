import { html, literal } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import { css, LitElement } from 'lit';
import dsStyles from '@digdir/designsystemet-css/heading.css?inline';
import { styled } from '../mixins/tailwind.mixin';
declare global {
  interface HTMLElementTagNameMap {
    'mid-heading': MinidHeading;
  }
}

const styles = [
  dsStyles,
  css`
    :host {
      display: block;
    }
  `,
];

@customElement('mid-heading')
export class MinidHeading extends styled(LitElement, styles) {
  @property({ type: Number })
  level: 1 | 2 | 3 | 4 | 5 | 6 = 1;

  @property()
  size: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';

  /**
   * Margin bottom.
   * Corresponds to `--ds-size-*`
   */
  @property({ type: Number })
  spacing: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

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

    return html`<${tag}
      class="ds-heading"
      data-size="${this.size}"
      style="margin-bottom: var(--ds-size-${this.spacing})"
    >
      <slot></slot>
    </${tag}>`;
  }
}
