import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/textfield.component.js';
import '../components/button.component.js';

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
    html`<form class="flex w-100 flex-col gap-4">
        <mid-textfield
          label="Tekst input"
          required
          pattern="^[a-zA-Z0-9]{5,30}$"
          name="textfield-data"
          value="initialValue"
        ></mid-textfield>
        <div class="flex flex-row-reverse items-end justify-end gap-4">
          <pre class="output"></pre>
          <mid-button type="submit"> Submit </mid-button>
          <mid-button type="reset" variant="secondary"> Reset </mid-button>
        </div>
      </form>

      <script>
        var textfield = document.querySelector('mid-textfield');
        var form = document.querySelector('form');
        var output = document.querySelector('.output');

        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const formData = new FormData(form);
          const data = Object.fromEntries(formData);
          output.textContent = JSON.stringify({
            ...data,
          });
        });

        form.addEventListener('reset', () => {
          output.textContent = '';
        });

        textfield.addEventListener('mid-invalid-show', (event) => {
          if (event.detail.validity.patternMismatch) {
            textfield.validationmessage = 'Invalid pattern';
          } else if (event.detail.validity.valueMissing) {
            textfield.validationmessage = 'Value is required';
          } else {
            textfield.validationmessage = 'Invalid input';
          }
        });

        textfield.addEventListener('mid-invalid-hide', (event) => {
          textfield.validationmessage = '';
        });
      </script> `,
};
