import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/code-input.component';
import '../components/button.component'

type CodeInputProps = {};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Under arbeid/Code Input',
  component: 'mid-code-input',
  argTypes: {},
} satisfies Meta<CodeInputProps>;

export default meta;
type Story = StoryObj<CodeInputProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {},
  render: (args, context) => {
    return html`
      <p>The code input component supports HTML Constraint Validation, custom error message, custom error display, and implements WebOTP API. Try submitting without the full code to trigger error handling.</p>
      <br/>

      <b>Custom error display</b>
      <form class="pb-8">
        <mid-code-input required>
          <div class="error-message" style="color: indianred" slot="error-message"></div>
        </mid-code-input>
        <mid-button class="pt-2" type="submit">Submit</mid-button>
      </form>
      
      <b>With browsers built-in error display</b>
      <form class="pb-8">
        <mid-code-input required>
        </mid-code-input>
        <mid-button class="pt-2" type="submit">Submit</mid-button>
      </form>

      <b>With custom error message and custom error display</b>
      <form class="pb-8">
        <mid-code-input error-message="Generic error type 5 occurred..." required>
          <div class="error-message" style="color: indianred" slot="error-message"></div>
        </mid-code-input>
        <mid-button class="pt-2" type="submit">Submit</mid-button>
      </form>
    `;
  },
};

