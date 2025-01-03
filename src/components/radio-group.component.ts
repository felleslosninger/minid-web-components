import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styled } from 'src/mixins/tailwind.mixin';
import './label.component';
import { ConstraintsValidationMixin } from 'src/mixins/form-controller.mixin';
import { MinidRadioButton } from 'src/components/radio-button.component';
import { classMap } from 'lit/directives/class-map.js';
import { watch } from 'src/internal/watch';

const styles = [
  css`
    :host {
      display: block;
    }
  `,
];

@customElement('mid-radio-group')
export class MinidRadioGroup extends ConstraintsValidationMixin(
  styled(LitElement, styles)
) {
  @property()
  name = 'options';

  /**
   * The current value of the radio group.
   */
  @property({ reflect: true })
  value = '';

  @property()
  label = '';

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  @state()
  private hasButtonRadios = false;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    this.reportValidity();
  }

  private async syncRadioElements() {
    const radios = this.getAllRadios();

    await Promise.all(
      // Sync the checked state and size
      radios.map(async (radio) => {
        await radio.updateComplete;
        radio.checked = radio.value === this.value;
        radio.size = this.size;
      })
    );

    this.hasButtonRadios = radios.some(
      (radio) => radio.tagName.toLowerCase() === 'mid-radio-button'
    );

    if (radios.length > 0 && !radios.some((radio) => radio.checked)) {
      if (this.hasButtonRadios) {
        const buttonRadio = radios[0].shadowRoot?.querySelector('button');

        if (buttonRadio) {
          buttonRadio.setAttribute('tabindex', '0');
        }
      } else {
        radios[0].setAttribute('tabindex', '0');
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

  // formAssociatedCallback(form: HTMLFormElement) {
  //   console.log('form', form);

  //   this.syncRadios();
  // }

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
        radio.setAttribute('tabindex', '-1');
      }
    });

    this.value = radios[index].value;
    radios[index].checked = true;

    if (!this.hasButtonRadios) {
      radios[index].setAttribute('tabindex', '0');
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
      this.querySelectorAll<MinidRadioButton>('mid-radio, mid-radio-button')
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
    const target = (event.target as HTMLElement).closest<MinidRadioButton>(
      'mid-radio, mid-radio-button'
    )!;
    const radios = this.getAllRadios();
    const oldValue = this.value;

    if (!target || target.disabled) {
      return;
    }

    this.value = target.value;
    radios.forEach((radio) => {
      radio.checked = radio === target;
    });

    this.setFormValue(this.value);

    if (this.value !== oldValue) {
      this.dispatchEvent(
        new Event('mid-change', { bubbles: true, composed: true })
      );
      this.dispatchEvent(
        new Event('mid-input', { bubbles: true, composed: true })
      );
    }
  }

  // private async syncRadioElements() {
  //   const radios = this.getAllRadios();

  //   await Promise.all(
  //     // Sync the checked state and size
  //     radios.map(async (radio) => {
  //       await radio.updateComplete;
  //       radio.checked = radio.value === this.value;
  //       radio.size = this.size;
  //     })
  //   );

  //   this.hasButtonGroup = radios.some(
  //     (radio) => radio.tagName.toLowerCase() === 'mid-radio-button'
  //   );

  //   if (radios.length > 0 && !radios.some((radio) => radio.checked)) {
  //     if (this.hasButtonGroup) {
  //       const buttonRadio = radios[0].shadowRoot?.querySelector('button');

  //       if (buttonRadio) {
  //         buttonRadio.setAttribute('tabindex', '0');
  //       }
  //     } else {
  //       radios[0].setAttribute('tabindex', '0');
  //     }
  //   }

  //   if (this.hasButtonGroup) {
  //     const buttonGroup = this.shadowRoot?.querySelector('mid-button-group');

  //     if (buttonGroup) {
  //       buttonGroup.disableRole = true;
  //     }
  //   }
  // }

  @watch('size', { waitUntilFirstUpdate: true })
  handleSizeChange() {
    this.syncRadios();
  }

  @watch('value')
  handleValueChange() {
    if (this.hasUpdated) {
      this.updateCheckedRadio();
    }
  }

  /** Sets focus on the radio-group. */
  public focus(options?: FocusOptions) {
    const radios = this.getAllRadios();
    const checked = radios.find((radio) => radio.checked);
    const firstEnabledRadio = radios.find((radio) => !radio.disabled);

    const radioToFocus = checked || firstEnabledRadio;

    // Call focus for the checked radio
    // If no radio is checked, focus the first one that is not disabled
    if (radioToFocus) {
      radioToFocus.focus(options);
    }
  }

  override render() {
    return html`
      <!-- <mid-label spacing size=${this.size}>${this.label}</mid-label> -->
      <label
        part="form-control-label"
        id="label"
        class="class=${classMap({
          'fds-label': true,
          'fds-label--spacing': true,
          'fds-label--sm': this.size === 'sm',
          'fds-label--md': this.size === 'md',
          'fds-label--lg': this.size === 'lg',
        })}"
        @click=${this.handleLabelClick}
      >
        ${this.label}
      </label>
      <fieldset
        class="fds-togglegroup flex"
        part="form-control"
        role="radiogroup"
        aria-labelledby="label"
      >
        <div class="sr-only">
          <label class="radio-group__validation">
            <input
              type="text"
              class="radio-group__validation-input"
              tabindex="-1"
              hidden
            />
          </label>
        </div>
        <div
          class="fds-togglegroup__content"
          part="base"
          role="group"
          aria-label=${this.label}
          @focusin=${this.focus}
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
