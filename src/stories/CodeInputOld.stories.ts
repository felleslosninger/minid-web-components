import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/code-input-old.component';
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
  title: 'Komponenter/Code Input Old',
  tags: ['deprecated'],
  component: 'mid-code-input-old',
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
      <mid-code-input-old
        label="${ifDefined(label)}"
        value=${ifDefined(value)}
        inputmode=${ifDefined(inputmode)}
        length=${ifDefined(length)}
        fontsize=${ifDefined(fontsize)}
        invalidmessage=${ifDefined(invalidmessage)}
        ?disabled=${disabled}
        ?hidelabel=${hidelabel}
      >
      </mid-code-input-old>
    `;
  },
};
