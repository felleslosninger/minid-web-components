import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styled } from 'src/mixins/tailwind.mixin';
import './label.component';
import { ConstraintsValidationMixin } from 'src/mixins/form-controller.mixin';
import { MinidRadioButton } from 'src/components/radio-button.component';
import { classMap } from 'lit/directives/class-map.js';
import { watch } from 'src/internal/watch';
import { MinidRadio } from 'src/components/radio.component';

const styles = [
  css`
    :host {
      display: block;
    }

    :host:invalid fieldset {
      border: 2px solid red;
      outline: 2px solid red;
    }

    .error {
      border: 2px solid red;
      outline: 2px solid red;
    }

    .fds-label {
      margin-bottom: 1rem;
    }
  `,
];

@customElement('mid-radio-group')
export class MinidRadioGroup extends ConstraintsValidationMixin(
  styled(LitElement, styles)
) {
  @query('.fieldset')
  fieldset!: HTMLFieldSetElement;
  /**
   * The name of the radio group.
   */
  @property()
  name = 'option';

  /**
   * The current value of the radio group.
   */
  @property({ reflect: true })
  value: string | null = null;

  @property()
  label = '';

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  @property({ type: Boolean })
  labelhidden = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  @state()
  private hasButtonRadios = false;

  @state()
  defaultValue: string | null = null;

  constructor() {
    super();

    this.addEventListener('focus', () => {
      this.focus();
    });
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.defaultValue = this.value;
    this.setFormValue(this.value);
    // this.setValidity(
    //   { valueMissing: true } as ValidityState,
    //   'Feltet er påkrevd'
    // );
    this.validate();
    this.setAttribute('tabindex', '0');
  }

  protected formResetCallback() {
    this.value = this.defaultValue;
    this.validate();
    this.setFormValue(this.value);
    this.updateCheckedRadio();
  }

  private async syncRadioElements() {
    const radios = this.getAllRadios();
    this.hasButtonRadios = radios.some(
      (radio) => radio.tagName.toLowerCase() === 'mid-radio-button'
    );

    await Promise.all(
      // Sync the checked state and size
      radios.map(async (radio) => {
        await radio.updateComplete;
        radio.checked = radio.value === this.value;
        radio.size = this.size;
        radio.name = this.name;
      })
    );

    if (radios.length > 0 && !radios.some((radio) => radio.checked)) {
      if (this.hasButtonRadios) {
        const buttonRadio = radios[0].shadowRoot?.querySelector('button');
        if (buttonRadio) {
          buttonRadio.setAttribute('tabindex', '0');
        }
      } else {
        radios[0].element.setAttribute('tabindex', '0');
      }
    }
  }

  private syncRadios() {
    if (
      customElements.get('mid-radio') &&
      customElements.get('mid-radio-button')
    ) {
      this.syncRadioElements();
      return;
    }

    if (customElements.get('mid-radio')) {
      this.syncRadioElements();
    } else {
      customElements.whenDefined('mid-radio').then(() => this.syncRadios());
    }

    if (customElements.get('mid-radio-button')) {
      this.syncRadioElements();
    } else {
      // Rerun this handler when <mid-radio> or <mid-radio-button> is registered
      customElements
        .whenDefined('mid-radio-button')
        .then(() => this.syncRadios());
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (
      !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(
        event.key
      )
    ) {
      return;
    }

    const radios = this.getAllRadios().filter((radio) => !radio.disabled);
    const checkedRadio = radios.find((radio) => radio.checked) ?? radios[0];
    const incr =
      event.key === ' '
        ? 0
        : ['ArrowUp', 'ArrowLeft'].includes(event.key)
          ? -1
          : 1;
    const oldValue = this.value;
    let index = radios.indexOf(checkedRadio) + incr;

    if (index < 0) {
      index = radios.length - 1;
    }

    if (index > radios.length - 1) {
      index = 0;
    }

    this.getAllRadios().forEach((radio) => {
      radio.checked = false;

      if (!this.hasButtonRadios) {
        radio.element.setAttribute('tabindex', '-1');
      }
    });

    this.value = radios[index].value;
    radios[index].checked = true;
    this.setFormValue(this.value);

    if (!this.hasButtonRadios) {
      // radios[index].setAttribute('tabindex', '0');
      radios[index].element.setAttribute('tabindex', '0');
      radios[index].focus();
    } else {
      radios[index].shadowRoot!.querySelector('button')!.focus();
    }

    if (this.value !== oldValue) {
      this.dispatchEvent(
        new Event('mid-change', { bubbles: true, composed: true })
      );
      this.dispatchEvent(
        new Event('mid-input', { bubbles: true, composed: true })
      );
    }

    event.preventDefault();
  }

  private getAllRadios() {
    return Array.from(
      this.querySelectorAll<MinidRadioButton | MinidRadio>(
        'mid-radio, mid-radio-button'
      )
    );
  }

  private updateCheckedRadio() {
    const radios = this.getAllRadios();
    radios.forEach((radio) => {
      radio.checked = radio.value === this.value;
    });
  }

  private handleLabelClick() {
    this.focus();
  }

  private handleRadioClick(event: MouseEvent) {
    const target = (event.target as HTMLElement).closest<
      MinidRadioButton | MinidRadio
    >('mid-radio, mid-radio-button')!;
    // const radios = this.getAllRadios();

    const oldValue = this.value;

    if (!target || target.disabled) {
      return;
    }

    this.value = target.value;
    this.setFormValue(this.value);

    this.updateCheckedRadio();

    if (this.value !== oldValue) {
      this.dispatchEvent(
        new Event('mid-change', { bubbles: true, composed: true })
      );
      this.dispatchEvent(
        new Event('mid-input', { bubbles: true, composed: true })
      );
    }
  }

  validate() {
    if (this.required && !this.value) {
      this.setValidity(
        { valueMissing: true } as ValidityState,
        'Feltet er påkrevd'
      );
    } else {
      this.setValidity({} as ValidityState, '');
    }
  }

  @watch('size', { waitUntilFirstUpdate: true })
  handleSizeChange() {
    this.syncRadios();
  }

  @watch('value')
  handleValueChange() {
    console.log(
      'Value: ',
      this.value,
      'required ',
      this.required,
      'hasupdated: ',
      this.hasUpdated
    );

    this.validate();

    if (this.hasUpdated) {
      this.updateCheckedRadio();
    }
  }

  @watch('disabled')
  handleDisabledChange() {
    const radios = this.getAllRadios();
    const every = radios.every((radio) => radio.disabled);
    const some = radios.some((radio) => radio.disabled);
    radios.forEach((radio) => {
      if (every === some) {
        radio.disabled = this.disabled;
      } else if (this.disabled) {
        radio.disabled = true;
      }
    });
  }

  /**
   *  Sets focus on the radio-group.
   */
  public focus(options?: FocusOptions) {
    console.log('focus! 🔎');

    const radios = this.getAllRadios();
    const checked = radios.find((radio) => radio.checked);
    const firstEnabledRadio = radios.find((radio) => !radio.disabled);

    const radioToFocus = checked || firstEnabledRadio;

    console.log(radioToFocus);

    // Call focus for the checked radio
    // If no radio is checked, focus the first one that is not disabled
    if (radioToFocus) {
      radioToFocus.focus(options);
    }
  }

  override render() {
    return html`
      <label
        part="form-control-label"
        id="label"
        class="class=${classMap({
          'fds-label': true,
          'fds-label--spacing': true,
          'fds-label--sm': this.size === 'sm',
          'fds-label--md': this.size === 'md',
          'fds-label--lg': this.size === 'lg',
          'sr-only': this.labelhidden,
        })}"
        @click=${this.handleLabelClick}
      >
        ${this.label}
      </label>
      <fieldset
        class="${classMap({
          flex: true,
          'fds-togglegroup': this.hasButtonRadios,
          fieldset: true,
        })}"
        part="form-control"
        role="radiogroup"
        aria-labelledby="label"
        name=${this.name}
        @focus=${this.focus}
      >
        <div
          class="${classMap({
            'fds-togglegroup__content': this.hasButtonRadios,
          })} grid gap-3"
          part="base"
          role="presentation"
          aria-label=${this.label}
        >
          <slot
            @slotchange=${this.syncRadios}
            @click=${this.handleRadioClick}
            @keydown=${this.handleKeyDown}
          ></slot>
        </div>
      </fieldset>
    `;
  }
}
