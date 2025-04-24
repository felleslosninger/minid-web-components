import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { webOtpApiClose, webOtpApiInit } from '../utilities/web-otp-api';
import { styled } from '../mixins/tailwind.mixin';
import { ConstraintsValidationMixin } from '../mixins/form-controller.mixin';
import './icon/icon.component';

declare global {
  interface HTMLElementTagNameMap {
    'mid-code-input': MinidCodeInput;
  }
}

const styles = [
  css`
    :host {
      display: flex;
      flex-direction: column;
      container: otc / inline-size;
      text-align: left;
      --otc-background: white;
      --otc-error-background: white;
      --otc-length: 5;
      --otc-width: 11.45cqw;
    }

    input {
      all: unset;
      background: var(--otc-background);
      caret-color: transparent;
      clip-path: inset(0% 1ch 0% 0%);
      font-family: ui-monospace, monospace;
      font-size: var(--otc-width);
      inline-size: calc(var(--otc-length) * 3ch);
      letter-spacing: 2ch;
      padding-block: 0.25ch;
      padding-inline-start: calc(0.5ch * 1.5);
      flex-grow: 1;

      &:focus-visible:focus {
        outline-style: none;
      }

      &:-webkit-autofill {
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
      background: var(--otc-error-background);
    }
  `,
];

let nextUniqueId = 0;

@customElement('mid-code-input')
export class MinidCodeInput extends ConstraintsValidationMixin(
  styled(LitElement, styles)
) {
  private readonly caretColor = 'var(--color-neutral-surface-tinted)';
  private readonly caretHighlightColor = 'var(--color-accent-surface-active)';
  private readonly inputId = `mid-code-input-${nextUniqueId++}`;

  public inputRef: Ref<HTMLInputElement> = createRef();

  @property({ type: String, reflect: true })
  value = '';

  @property()
  label = '';

  /**
   * Visually hides `label` (still available for screen readers)
   */
  @property({ type: Boolean })
  hidelabel = false;

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  inputmode = 'numeric';

  /**
   * Display custom error message, and force invalid state
   */
  @property()
  invalidmessage = '';

  /**
   * The length of the code input
   */
  @property({ type: Number })
  length = 5;

  @property()
  fontsize = '11.45cqw';

  @state()
  renderError = false;

  @state()
  localErrorNode: Node | null = null;

  constructor() {
    super();
    this.addEventListener('invalid', (e) => {
      this.renderError = true;
      if (this.localErrorNode) {
        e.preventDefault();
        this.localErrorNode.textContent = this.validationMessage || 'Error';
      }
    });
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

  private calcInputStyle() {
    const inputStyle = this.inputRef.value?.style;

    inputStyle?.setProperty('--otc-length', this.length.toString());

    let gradientStyle = 'linear-gradient(90deg, ';
    for (let i = 0; i < this.length; i++) {
      gradientStyle += `var(--char-${i + 1}-color) ${i ? i * 3 + 'ch' : '0'} ${i * 3 + 2.5}ch, transparent ${i * 3 + 2.5}ch ${i * 3 + 3}ch${i + 1 < this.length ? ', ' : ''}`;
    }
    gradientStyle += `) no-repeat 0 0 / ${this.length * 3}ch 100%`;
    inputStyle?.setProperty('--otc-background', gradientStyle);

    const gradientErrorStyle = `linear-gradient(90deg, var(--color-danger-surface-active) calc(${this.length}ch / 2), transparent 0) 0 0 / 3ch 100%`;
    inputStyle?.setProperty('--otc-error-background', gradientErrorStyle);

    inputStyle?.setProperty('--otc-width', this.fontsize);
  }

  private autoFillEventHandler(e: AnimationEvent) {
    e.animationName === 'onAutoFillStart' &&
      (this.value = (this.inputRef.value as HTMLInputElement).value);
  }

  get selectionEnd() {
    return this.inputRef.value?.selectionEnd;
  }

  private handleFocusOut() {
    for (let i = 0; i < this.length; i++) {
      this.inputRef.value?.style.setProperty(
        `--char-${i + 1}-color`,
        this.caretColor
      );
    }
  }

  private handleFocusIn = () => {
    const currentChar = this.value.length + 1;
    this.inputRef.value?.style.setProperty(
      `--char-${currentChar}-color`,
      this.caretHighlightColor
    );
  };

  private handleClick() {
    this.value = this.value.substring(0, this.selectionEnd || 0);

    this.renderError = false;
    this.setCustomValidity('');
    if (this.localErrorNode) {
      this.localErrorNode.textContent = '';
    }

    this.setFormValue(this.value);
    this.setValidity({} as ValidityState);
  }

  private handleKeydown(event: KeyboardEvent) {
    const hasModifier =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    // Pressing enter when focused on an input should submit the form like a native input, but we wait a tick before
    // submitting to allow users to cancel the keydown event if they need to
    if (event.key === 'Enter' && !hasModifier) {
      setTimeout(() => {
        //
        // When using an Input Method Editor (IME), pressing enter will cause the form to submit unexpectedly. One way
        // to check for this is to look at event.isComposing, which will be true when the IME is open.
        if (!event.defaultPrevented && !event.isComposing) {
          this.internals.form?.requestSubmit();
        }
      });
    }
  }

  private handleChange = (e: Event) => {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(
      new Event('input', {
        bubbles: true,
        cancelable: true,
        composed: true,
      })
    );
  };

  private handleSlotchange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const childNodes = slot.assignedNodes({ flatten: true });

    this.localErrorNode = this.findErrorMessageNode(childNodes);
    if (this.localErrorNode && this.invalidmessage) {
      // display if slot set, and error override in effect
      this.renderError = true;
      this.localErrorNode.textContent = this.invalidmessage;
      this.setValidity({} as ValidityState); // cancel built-in visual feedback
    }
  }

  private findErrorMessageNode(nodes: Node[]): Node | null {
    for (const node of nodes) {
      if (node instanceof Element && node.classList.contains('error-message')) {
        return node;
      }
      const childNodesArray = Array.from(node.childNodes);
      const foundNode = this.findErrorMessageNode(childNodesArray);
      if (foundNode) {
        return foundNode;
      }
    }
    return null;
  }

  firstUpdated(_changedProperties: PropertyValues) {
    this.focus();
    webOtpApiInit(this.renderRoot);
  }

  updated(_changedProperties: PropertyValues): void {
    for (let i = 0; i < this.length; i++) {
      const color =
        i === this.value.length ? this.caretHighlightColor : this.caretColor;
      this.inputRef.value?.style.setProperty(`--char-${i + 1}-color`, color);
    }

    if (_changedProperties.has('_forcedErrorMessage')) {
      this.setCustomValidity(this.invalidmessage);
    }

    this.setFormValue(this.value);
    this.setValidity(
      this.inputRef.value!.validity,
      this.inputRef.value!.validationMessage,
      this.inputRef!.value
    );
  }

  focus(options?: FocusOptions) {
    const notMobile = !window.matchMedia('only screen and (max-width: 768px)')
      .matches;
    notMobile && this.inputRef.value?.focus(options);
  }

  setCustomValidity(error: string) {
    this.inputRef!.value?.setCustomValidity(error);
  }

  override render() {
    return html`
      <label
        class="${classMap({
          'sr-only': this.hidelabel,
          'mb-2': !!this.label,
        })} font-medium"
        for="${this.inputId}"
        >${this.label}
      </label>
      <input
        ${ref(this.inputRef)}
        id=${this.inputId}
        .value="${live(this.value)}"
        class="${classMap({
          error: this.invalidmessage,
        })}"
        autocomplete="${'one-time-code' as any}"
        inputmode="${this.inputmode}"
        @input="${this.handleChange}"
        @change="${this.handleChange}"
        @focusout="${this.handleFocusOut}"
        @focusin="${this.handleFocusIn}"
        @keydown="${this.handleKeydown}"
        @click="${this.handleClick}"
        minlength="${this.length}"
        maxlength="${this.length}"
        ?disabled="${this.disabled}"
        ?required="${this.required}"
      />
      <slot name="error-message" @slotchange=${this.handleSlotchange}>
        <div
          class="text-danger-subtle mt-2 flex gap-1"
          aria-live="polite"
          ?hidden=${!this.invalidmessage}
        >
          <mid-icon
            name="xmark-octagon-fill"
            class="mt-1 min-h-5 min-w-5"
          ></mid-icon>
          ${this.invalidmessage}
        </div>
      </slot>
    `;
  }
}
