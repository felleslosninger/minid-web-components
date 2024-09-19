import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import style from '@digdir/designsystemet-css?inline';
import theme from '@digdir/designsystemet-theme?inline';
import { TailwindLitElement } from 'src/lib/mixins/tailwind.mixin';

@customElement('mwc-button')
export class Button extends TailwindLitElement {
  static override styles = [unsafeCSS(theme), unsafeCSS(style)];

  @property({ type: String })
  variant?: 'primary' | 'secondary' | 'tertiary';

  override render() {
    return html`<button
      class="fds-btn fds-btn--first fds-btn--md fds-btn--secondary fds-focus"
    >
      <slot></slot>
    </button>`;
  }
}
