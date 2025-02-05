import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/code-input.component';
import '../components/button.component';

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
      <p>
        The code input component supports HTML Constraint Validation, custom
        error message, custom error display, and implements WebOTP API. Try
        submitting without the full code to trigger error handling.
      </p>
      <br />

      <form class="pb-8">
        <mid-code-input required label="Custom error display">
          <div
            class="error-message"
            style="color: indianred"
            slot="error-message"
          ></div>
        </mid-code-input>
        <mid-button class="block pt-2" type="submit">Submit</mid-button>
      </form>

      <form class="pb-8">
        <mid-code-input required label="With browsers built-in error display">
        </mid-code-input>
        <mid-button class="block pt-2" type="submit">Submit</mid-button>
      </form>

      <form class="pb-8">
        <mid-code-input
          label="With custom error message and custom error display"
          error-message="Generic error type 5 occurred..."
          required
        >
          <div
            class="error-message"
            style="color: indianred"
            slot="error-message"
          ></div>
        </mid-code-input>
        <mid-button class="block pt-2" type="submit">Submit</mid-button>
      </form>

      <form class="pb-8">
        <mid-code-input
          label="With custom error message and built-in error display"
          error-message="Generic error type 5 occurred..."
          required
        >
        </mid-code-input>
        <mid-button class="block pt-2" type="submit">Submit</mid-button>
      </form>
    `;
  },
};
