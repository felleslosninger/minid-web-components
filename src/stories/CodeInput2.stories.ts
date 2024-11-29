import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/code-input-2.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type CodeInputProps = {
  length?: number;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Under arbeid/Code Input 2',
  component: 'mid-code-input-2',
  argTypes: {},
} satisfies Meta<CodeInputProps>;

export default meta;
type Story = StoryObj<CodeInputProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {},
  render: ({ length: fields }: CodeInputProps) => {
    return html`<mid-code-input-2
      fields="${ifDefined(fields)}"
    ></mid-code-input-2>`;
  },
};
