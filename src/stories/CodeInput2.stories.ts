import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/code-input-2.component';

type CodeInputProps = {};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Code Input 2',
  component: 'mid-code-input-2',
  argTypes: {},
} satisfies Meta<CodeInputProps>;

export default meta;
type Story = StoryObj<CodeInputProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {},
  render: (args: CodeInputProps) => {
    return html`<mid-code-input-2></mid-code-input-2>`;
  },
};
