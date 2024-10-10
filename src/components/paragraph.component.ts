import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { tailwind } from 'src/mixins/tailwind.mixin';

/**
 * A paragraph
 */
@customElement('mid-paragraph')
export class MinidParagraph extends tailwind(LitElement) {
  /**
   * `'md' = 18px`
   * `'sm' = 16px`
   * `'lg' = 21px`
   * @default 'md'
   */
  @property()
  size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

  @property({ type: Boolean })
  spacing = true;

  override render() {
    return html` <slot></slot> `;
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null
  ): void {
    console.log(name, value);

    this.className = '';
    this.classList.add('fds-paragraph');

    if (name === 'spacing' && value !== null) {
      this.classList.add('fds-paragraph--spacing');
    }

    if (value === 'xs') {
      this.classList.add('fds-paragraph--xs');
    }

    if (value === 'sm') {
      this.classList.add('fds-paragraph--sm');
    }

    if (value === 'md') {
      this.classList.add('fds-paragraph--md');
    }

    if (value === 'lg') {
      this.classList.add('fds-paragraph--lg');
    }
  }
}
