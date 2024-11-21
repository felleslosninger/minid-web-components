import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { styled } from 'src/mixins/tailwind.mixin';

const styles = [
  css`
    :host {
      display: flex;
    }

    .country-code,
    .phone-number {
      outline: none;
      box-shadow: none;
      background-color: transparent;
      /* padding: 0 1rem; */
    }

    .country-code {
      border-right: 1px solid currentColor;
    }

    .fds-focus:focus-within {
      --fds-focus-border-width: 3px;
      outline: var(--fds-focus-border-width) solid
        var(--fds-semantic-border-focus-outline);
      outline-offset: var(--fds-focus-border-width);
      box-shadow: 0 0 0 var(--fds-focus-border-width)
        var(--fds-semantic-border-focus-boxshadow);
    }
  `,
];

@customElement('mid-phone-input')
export class MinidPhoneInput extends styled(LitElement, styles) {
  @query('.country-code')
  countryCodeInput!: HTMLInputElement;

  @property()
  value = '';

  @query('.phone-number')
  phoneNumberInput!: HTMLInputElement;

  @property({ reflect: true })
  countrycode = '';

  @property({ reflect: true })
  phonenumber = '';

  @property()
  label = '';

  @state()
  hasFocus = false;

  private handleBlur() {
    this.hasFocus = false;
    this.dispatchEvent(
      new Event('mid-blur', { bubbles: true, composed: true })
    );
  }

  private handleChange() {
    this.value = this.countryCodeInput.value;
    this.dispatchEvent(
      new Event('mid-change', { bubbles: true, composed: true })
    );
  }

  private handleInput() {
    this.countrycode = this.countryCodeInput.value;

    this.dispatchEvent(
      new CustomEvent('mid-input', {
        bubbles: true,
        composed: true,
        detail: {
          countryCode: this.countrycode,
          phoneNumber: this.phonenumber,
        },
      })
    );
  }

  private handleFocus() {
    this.hasFocus = true;
    this.dispatchEvent(
      new Event('mid-focus', { composed: true, bubbles: true })
    );
  }

  override render() {
    const lg = false;
    const md = true;
    const sm = false;
    return html`
      <div
        part="form-control"
        class="${classMap({
          'form-control': true,
          'fds-paragraph': true,
          'fds-textfield': true,
          //   'fds-textfield--readonly': this.readonly,
          'fds-paragraph--sm': sm,
          'fds-paragraph--md': md,
          'fds-paragraph--lg': lg,
          'fds-textfield--sm': sm,
          'fds-textfield--md': md,
          'fds-textfield--lg': lg,
        })}"
      >
        ${!this.label
          ? nothing
          : html`<label
              for="input"
              class="${classMap({
                // 'sr-only': this.hidelabel,
                'fds-label': true,
                'fds-label--medium-weight': true,
                'fds-textfield__label': true,
                'fds-label--sm': sm,
                'fds-label--md': md,
                'fds-label--lg': lg,
              })}"
            >
              ${this.label}
            </label>`}
        <div
          part="base"
          class="${classMap({
            field: true,
            'fds-textfield__field': true,
            'fds-textfield__input': true,
            'fds-focus': this.hasFocus,
          })}"
        >
          <span class="prefix">
            <slot name="prefix"></slot>
          </span>
          <input
            part="country-code"
            class="country-code"
            placeholder="+47"
            size="5"
            maxlength="5"
            aria-describedby="description"
            .value=${live(this.countrycode)}
            @input=${this.handleInput}
            @change=${this.handleChange}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
          />

          <input
            class="phone-number"
            part="phone-number"
            .value=${live(this.phonenumber)}
            @input=${this.handleInput}
            @change=${this.handleChange}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
          />

          <span part="suffix" class="suffix">
            <slot name="suffix"></slot>
          </span>
        </div>
      </div>
    `;
  }
}
