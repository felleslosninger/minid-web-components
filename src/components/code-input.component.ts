import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styled } from 'src/mixins/tailwind.mixin';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import {webOtpApiClose, webOtpApiInit} from "./utilities/web-otp-api";

const styles = [
  css`
    :host {
      container: otc / inline-size;
      text-align: left;
      width: 30rem;
    }

    input {
      all: unset;
      background: var(--otc-background);
      caret-color: transparent;
      clip-path: inset(0% 1ch 0% 0%); /* clip 1ch wide, right side */
      font-family: ui-monospace, monospace;
      font-size: var(--otc-width);
      inline-size: calc(var(--otc-length) * 3ch);
      letter-spacing: 2ch;
      padding-block: 0.25ch; /* padding top & bottom */
      padding-inline-start: calc(0.5ch * 1.5); /* padding left */

      &:focus-visible:focus {
        outline-style: none; /* hide artifact from focus-visible outline style */
      }

      &:-webkit-autofill {
        /* safari autofill detect */
        animation-name: onAutoFillStart;
      }
    }

    @keyframes onAutoFillStart {
      from {
      }
      to {
      }
    }

    input.error {
      background: var(
        --otc-error-background
      ); /* repeating two-color horizontal gradient 3ch wide */
    }

    #error-box {
      color: rgb(179, 38, 30);
      font-size: 18px;
      font-weight: 400;
    }
  `,
];

@customElement('mid-code-input')
export class MinidCodeInput extends styled(LitElement, styles) {
  caretColor = '#EEE';
  caretHighlightColor = '#bee3f5';

  static formAssociated = true;
  private internals: ElementInternals;
  public inputRef: Ref<HTMLInputElement> = createRef();

  @property({ type: String, reflect: true })
  value = '';

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  inputMode = 'numeric';

  @property({ type: String })
  errorText?: string;

  @property({ type: Boolean })
  error = false;

  @property({ type: Number })
  length = 5;

  @property({ type: String, attribute: 'font-size' })
  fontSize = "3cqw";

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override connectedCallback() {
    super.connectedCallback();
    this._whenSettled();
  }

  async _whenSettled() {
    await this.updateComplete;
    this.inputRef.value?.addEventListener(
      'animationstart',
      this.autoFillEventHandler.bind(this)
    );
    this.calcInputStyle();
  }

  override disconnectedCallback() {
    webOtpApiClose();
    this.inputRef.value?.removeEventListener(
      'animationstart',
      this.autoFillEventHandler.bind(this)
    );
  }


  calcInputStyle() {
    const inputStyle = this.inputRef.value?.style;

    inputStyle?.setProperty('--otc-length', this.length.toString());

    let gradientStyle = 'linear-gradient(90deg, ';
    for (let i = 0; i < this.length; i++) {
      gradientStyle += `var(--char-${i + 1}-color) ${i ? i * 3 + 'ch' : '0'} ${i * 3 + 2.5}ch, transparent ${i * 3 + 2.5}ch ${i * 3 + 3}ch${i + 1 < this.length ? ', ' : ''}`;
    }
    gradientStyle += `) no-repeat 0 0 / ${this.length * 3}ch 100%`;
    inputStyle?.setProperty('--otc-background', gradientStyle);

    const gradientErrorStyle = `linear-gradient(90deg, rgba(179, 38, 30, 60%) calc(${this.length}ch / 2), transparent 0) 0 0 / 3ch 100%`;
    inputStyle?.setProperty('--otc-error-background', gradientErrorStyle);

    // const otcWidth =
    //   this.length === 4
    //     ? '14.5'
    //     : this.length === 5
    //       ? '11.45'
    //       : this.length === 6
    //         ? '9.45'
    //         : '8';
    // inputStyle?.setProperty('--otc-width', otcWidth + 'cqw');
    inputStyle?.setProperty('--otc-width', this.fontSize);
  }

  autoFillEventHandler(e: AnimationEvent) {
    /* safari autofill detect */
    e.animationName === 'onAutoFillStart' &&
      (this.value = (this.inputRef.value as HTMLInputElement).value);
  }

  get selectionEnd() {
    return this.inputRef.value?.selectionEnd;
  }

  firstUpdated(_changedProperties: PropertyValues) {
    this.focus();
    webOtpApiInit(this.renderRoot);
  }

  focus(options?: FocusOptions) {
    const notMobile = !window.matchMedia('only screen and (max-width: 768px)')
      .matches;
    notMobile && this.inputRef.value?.focus(options);
  }


  onFocusOut() {
    for (let i = 0; i < this.length; i++) {
      this.inputRef.value?.style.setProperty(
        `--char-${i + 1}-color`,
        this.caretColor
      );
    }
  }

  onFocusIn() {
    const currentChar = this.value.length + 1;
    this.inputRef.value?.style.setProperty(
      `--char-${currentChar}-color`,
      this.caretHighlightColor
    );
  }

  updated(_changedProperties: PropertyValues): void {
    // highlight current char
    for (let i = 0; i < this.length; i++) {
      const color = i === this.value.length ? this.caretHighlightColor : this.caretColor;
      this.inputRef.value?.style.setProperty(`--char-${i + 1}-color`, color);
    }

    this.internals.setFormValue(this.value);
    this.internals.setValidity(
      this.inputRef.value!.validity,
      this.errorText,
      this.inputRef!.value
    );
  }

  onClick() { // clear input to the right of where user clicked in the input field
    // this.otc = this.otc.substring(0, this.inputRef.value?.selectionEnd || 0);
    this.value = this.value.substring(0, this.selectionEnd || 0);
  }


  override render() {
    const errorDiv = this.error
      ? html`<div id="error-box" class="mb-5 pt-1" role="alert">
          <span>${this.errorText}</span>
        </div>`
      : nothing;

    return html`
      <div class="flex flex-col">
        <input
          ${ref(this.inputRef)}
          class="${classMap({
            'w-full': true,
            error: this.error,
            'mb-5': !this.error,
            'mb-0': this.error,
          })}"
          .value=${live(this.value)}
          autocomplete="${'one-time-code' as any}"
          inputmode=${this.inputMode}
          @input="${(e: InputEvent) => {
            this.value = (e.target as HTMLInputElement).value;
          }}"
          @change="${(e: Event) => {
            this.value = (e.target as HTMLInputElement).value;
            this.dispatchEvent(
              new Event('input', {
                bubbles: true,
                cancelable: true,
                composed: true,
              })
            );
          }}"
          @focusout="${() => {
            this.onFocusOut();
          }}"
          @focusin="${() => {
            this.onFocusIn();
          }}"
          @click="${this.onClick}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          maxlength=${this.length}
        />

        ${errorDiv}
      </div>
    `;
  }
}
