import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/code-input.component';
import '../components/button.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type CodeInputProps = Partial<{
  value: string;
  label: string;
  hidelabel: boolean;
  disabled: boolean;
  inputmode: string;
  invalidmessage: string;
  length: number;
  fontsize: string;
}>;

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
  args: {
    label: 'Engangskode',
  },
  decorators: [(story) => html`<div class="w-100">${story()}</div>`],
  render: ({
    invalidmessage,
    fontsize,
    disabled,
    hidelabel,
    inputmode,
    label,
    length,
    value,
  }) => {
    return html`
      <mid-code-input
        label="${ifDefined(label)}"
        value=${ifDefined(value)}
        inputmode=${ifDefined(inputmode)}
        length=${ifDefined(length)}
        fontsize=${ifDefined(fontsize)}
        invalidmessage=${ifDefined(invalidmessage)}
        ?disabled=${disabled}
        ?hidelabel=${hidelabel}
      >
      </mid-code-input>
    `;
  },
};
