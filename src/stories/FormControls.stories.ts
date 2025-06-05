import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/textfield.component.js';
import '../components/button.component.js';
import '../components/code-input.component.js';
import '../components/checkbox.component.js';
import '../components/combobox.component';
import '../components/menu.component';
import '../components/menu-item.component';
import '../components/phone-input.component';
import '../components/icon/icon.component';
import {
  CountryCode,
  countryLabelsNo,
  getCountries,
} from '../utilities/countries';

export interface FormControlProps {}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Form Controls',
  argTypes: {},
} satisfies Meta<FormControlProps>;

export default meta;
type Story = StoryObj<FormControlProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {},
  render: () =>
    html`<form id="form-1" class="flex w-100 flex-col gap-4">
        <mid-textfield
          id="textfield-1"
          label="Tekst input"
          required
          pattern="^[a-zA-Z0-9 ]{5,30}$"
          name="demo-data"
          value="initial value"
        >
        </mid-textfield>
        <div class="flex flex-row-reverse items-end justify-end gap-4">
          <pre id="output-1"></pre>
          <mid-button type="submit"> Submit </mid-button>
          <mid-button type="reset" variant="secondary"> Reset </mid-button>
        </div>
      </form>

      <script>
        var textfield = document.getElementById('textfield-1');
        var form1 = document.getElementById('form-1');
        var output1 = document.getElementById('output-1');

        form1.addEventListener('submit', (event) => {
          event.preventDefault();
          const formData = new FormData(form1);
          const data = Object.fromEntries(formData);
          output1.textContent = JSON.stringify({
            ...data,
          });
        });

        form1.addEventListener('reset', () => {
          output1.textContent = '';
        });

        textfield.addEventListener('mid-invalid-show', (event) => {
          if (event.detail.validity.patternMismatch) {
            textfield.invalidmessage = 'Verdien har ugyldig format';
          } else if (event.detail.validity.valueMissing) {
            textfield.invalidmessage = 'Feltet må fylles ut';
          } else {
            textfield.invalidmessage = 'Ugyldig verdi';
          }
          output1.textContent = '';
        });

        textfield.addEventListener('mid-invalid-hide', (event) => {
          textfield.invalidmessage = '';
        });
      </script> `,
};

export const CodeInput: Story = {
  args: {},
  render: () =>
    html`<form id="form-2" class="flex w-100 flex-col gap-4">
        <mid-code-input
          id="code-input-1"
          label="Tekst input"
          name="otc"
          required
          hidelabel
        >
        </mid-code-input>
        <div class="flex flex-row-reverse items-end justify-end gap-4">
          <pre id="output-2"></pre>
          <mid-button type="submit"> Submit </mid-button>
        </div>
      </form>

      <script>
        var codeInput = document.getElementById('code-input-1');
        var form2 = document.getElementById('form-2');
        var output2 = document.getElementById('output-2');

        form2.addEventListener('submit', (event) => {
          event.preventDefault();
          const formData = new FormData(form2);
          const data = Object.fromEntries(formData);
          output2.textContent = JSON.stringify({
            ...data,
          });
        });

        codeInput.addEventListener('input', (event) => {
          codeInput.invalidmessage = '';
        });

        codeInput.addEventListener('invalid', (event) => {
          event.preventDefault();
          const { validity } = event.target;
          if (validity.valueMissing) {
            codeInput.invalidmessage = 'Feltet må fylles ut';
          }
          if (validity.tooShort) {
            codeInput.invalidmessage = 'Litt kort bare';
          }
        });
      </script> `,
};

export const CheckboxInput: Story = {
  args: {},
  render: () =>
    html`<form id="form-3" class="flex w-100 flex-col gap-4">
        <mid-checkbox id="checkbox-1" required name="agree" value="yees">
          Godkjenn vilkår for å fortsette
        </mid-checkbox>
        <div class="flex flex-row-reverse items-end justify-end gap-4">
          <pre id="output-3"></pre>
          <mid-button type="submit"> Submit </mid-button>
        </div>
      </form>

      <script>
        var checkbox1 = document.getElementById('checkbox-1');
        var form3 = document.getElementById('form-3');
        var output3 = document.getElementById('output-3');

        form3.addEventListener('submit', (event) => {
          event.preventDefault();
          const formData = new FormData(form3);
          const data = Object.fromEntries(formData);
          output3.textContent = JSON.stringify({
            ...data,
          });
        });

        checkbox1.addEventListener('input', (event) => {
          checkbox1.invalid = false;
        });

        checkbox1.addEventListener('mid-invalid-show', (event) => {
          const { validity } = event.target;

          if (validity.valueMissing) {
            checkbox1.invalid = true;
          }
        });
      </script> `,
};

export const PhoneInput: Story = {
  args: {},
  render: () =>
    html`<form id="form-4" class="mb-74 flex w-100 flex-col">
        <mid-combobox>
          <mid-phone-input
            id="phone-input-1"
            name="phone"
            slot="trigger"
            class="phone-input w-full"
            country="NO"
            label="Telefonnummer"
            required
          >
          </mid-phone-input>
          <mid-menu searchable style="--max-height: 14rem">
            ${getCountries()
              .sort((a, b) =>
                Array<CountryCode>('NO', 'PL', 'DK', 'SE', 'US', 'GB').includes(
                  a
                )
                  ? -1
                  : a.localeCompare(b)
              )
              .slice(0, 10)
              .map((country) => {
                return html`<mid-menu-item value=${country}>
                  <mid-icon
                    class="h-4 w-6 overflow-hidden rounded"
                    library="country"
                    name="${country}"
                  ></mid-icon>
                  <span class="truncate">${countryLabelsNo[country]}</span>
                </mid-menu-item>`;
              })}
          </mid-menu>
        </mid-combobox>
        <div class="text-danger-subtle mt-2 flex gap-1" aria-live="polite">
          <span id="invalid-message-1"></span>
        </div>
        <div class="mt-4 flex flex-row-reverse items-end justify-end gap-4">
          <pre id="output-4"></pre>
          <mid-button type="submit"> Submit </mid-button>
        </div>
      </form>

      <script>
        var phoneInput1 = document.getElementById('phone-input-1');
        var form4 = document.getElementById('form-4');
        var output4 = document.getElementById('output-4');
        var invalidMessage1 = document.getElementById('invalid-message-1');

        form4.addEventListener('submit', (event) => {
          event.preventDefault();

          const formData = new FormData(form4);
          const data = Object.fromEntries(formData);
          output4.textContent = JSON.stringify({
            ...data,
          });
        });

        phoneInput1.addEventListener('mid-invalid-show', (event) => {
          if (event.detail.validity.patternMismatch) {
            phoneInput1.invalid = true;
            invalidMessage1.textContent = 'Verdien har ugyldig format';
          } else if (event.detail.validity.valueMissing) {
            phoneInput1.invalid = true;
            invalidMessage1.textContent = 'Feltet må fylles ut';
          } else {
            phoneInput1.invalid = true;
            invalidMessage1.textContent = 'Ugyldig verdi';
          }
          output1.textContent = '';
        });

        phoneInput1.addEventListener('mid-invalid-hide', (event) => {
          phoneInput1.invalid = false;
          invalidMessage1.textContent = '';
        });
      </script> `,
};
