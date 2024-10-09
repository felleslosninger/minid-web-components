import { MinidElement } from 'mixins/tailwind.mixin';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { stringConverter } from 'internal/string-converter';
import { classMap } from 'lit/directives/class-map.js';
import styles from '@digdir/designsystemet-css?inline';
import theme from '@digdir/designsystemet-theme?inline';
import { LitElement, unsafeCSS } from 'lit';

@customElement('mid-textfield')
export class MinidTextfield extends LitElement {
  @property()
  label = '';

  @property()
  value = '';

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  @property({ attribute: true, converter: stringConverter })
  placeholder = '';

  static override styles = [
    unsafeCSS(styles),
    unsafeCSS(theme),
    css`
      :host {
        display: flex;
      }
    `,
  ];

  override render() {
    const lg = this.size === 'lg';
    const md = this.size === 'md';
    const sm = this.size === 'sm';

    return html`
      <div
        class="${classMap({
          'fds-paragraph--sm': sm,
          'fds-paragraph--md': md,
          'fds-paragraph--lg': lg,
          'fds-textfield--sm': sm,
          'fds-textfield--md': md,
          'fds-textfield--lg': lg,
        })} fds-paragraph fds-textfield"
      >
        <label
          class="${classMap({
            'fds-label--sm': sm,
            'fds-label--md': md,
            'fds-label--lg': lg,
          })} fds-label fds-label--medium-weight fds-textfield__label"
        >
          ${this.label}
        </label>
        <div class="fds-textfield__field">
          <span
            class="icon icon relative flex w-14 items-center justify-center fill-current"
          >
            <slot name="left"></slot>
          </span>
          <input
            class="fds-textfield__input fds-focus"
            .value=${live(this.value)}
            .placeholder=${this.placeholder}
            @input=${this.handleInput}
          />
          <span
            class="icon relative flex w-14 items-center justify-center fill-current"
          >
            <slot name="right"></slot>
          </span>
        </div>
      </div>
    `;
  }

  private handleInput(event: InputEvent) {
    this.value = (event.target as HTMLInputElement).value;
  }
}
