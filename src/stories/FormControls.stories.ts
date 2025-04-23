import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/textfield.component.js';
import '../components/button.component.js';
import '../components/code-input.component.js';

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

export const Code: Story = {
  args: {},
  render: () =>
    html`<form id="form-2" class="flex w-100 flex-col gap-4">
        <mid-code-input label="Tekst input" name="demo-data" required hidelabel>
          <div
            id="validation-message"
            class="text-danger-subtle pt-2"
            slot="error-message"
          ></div>
        </mid-code-input>
        <div class="flex flex-row-reverse items-end justify-end gap-4">
          <pre id="output-2"></pre>
          <mid-button type="submit"> Submit </mid-button>
        </div>
      </form>

      <script>
        var codeInput = document.querySelector('mid-code-input');
        var form2 = document.getElementById('form-2');
        var output2 = document.getElementById('output-2');
        var errorElement = document.getElementById('validation-message');

        form2.addEventListener('submit', (event) => {
          event.preventDefault();
          const formData = new FormData(form2);
          const data = Object.fromEntries(formData);
          output2.textContent = JSON.stringify({
            ...data,
          });
        });

        codeInput.addEventListener('input', (event) => {
          codeInput._forcedErrorMessage = '';
          errorElement.textContent = '';
        });

        codeInput.addEventListener('invalid', (event) => {
          event.preventDefault();
          const { validity } = event.target;
          if (validity.valueMissing) {
            codeInput._forcedErrorMessage = 'Feltet må fylles ut';
            errorElement.textContent = 'Feltet må fylles ut';
          }
          if (validity.tooShort) {
            codeInput._forcedErrorMessage = 'Litt kort bare';
            errorElement.textContent = 'Litt kort bare';
          }
        });
      </script> `,
};
