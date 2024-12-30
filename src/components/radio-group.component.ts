import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styled } from 'src/mixins/tailwind.mixin';
import './label.component';
import { FormControllerMixin } from 'src/mixins/form-controller.mixin';
import { MinidRadioButton } from 'src/components/radio-button.component';

const styles = [
  css`
    :host {
      display: block;
    }
  `,
];

@customElement('mid-radio-group')
export class MinidRadioGroup extends FormControllerMixin(
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

  private syncRadios() {
    const radios = this.getAllRadios();
    radios.forEach((radio) => {
      radio.size = this.size;
      radio.checked = radio.value === this.value;
    });
  }

  formAssociatedCallback(form: HTMLFormElement) {
    console.log('form', form);

    this.syncRadios();
  }

  private handleKeyDown(event: KeyboardEvent) {
    // handle key down event
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
    radios.forEach((radio) => (radio.checked = radio === target));
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

  private handleBlur(event: FocusEvent) {
    // handle blur event
  }

  private handleFocus(event: FocusEvent) {
    // handle focus event
  }

  private handleMouseOver(event: MouseEvent) {
    // handle mouse over event
  }

  private handleMouseOut(event: MouseEvent) {
    // handle mouse out event
  }

  override render() {
    // <label
    //   part="form-control-label"
    //   id="label"
    //   class="class=${classMap({
    //     'fds-label': true,
    //     'fds-label--spacing': true,
    //     'fds-label--sm': this.size === 'sm',
    //     'fds-label--md': this.size === 'md',
    //     'fds-label--lg': this.size === 'lg',
    //   })}"
    // >
    //   ${this.label}
    // </label>

    return html`
      <mid-label spacing size=${this.size}>${this.label}</mid-label>
      <fieldset
        class="fds-togglegroup flex"
        part="form-control"
        role="radiogroup"
      >
        <div class="sr-only">
          <label class="radio-group__validation">
            <input
              type="text"
              class="radio-group__validation-input"
              tabindex="-1"
              hidden
              name=${this.name}
            />
          </label>
        </div>
        <div
          class="fds-togglegroup__content"
          part="base"
          role="group"
          aria-label=${this.label}
          @focusout=${this.handleBlur}
          @focusin=${this.handleFocus}
          @mouseover=${this.handleMouseOver}
          @mouseout=${this.handleMouseOut}
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
