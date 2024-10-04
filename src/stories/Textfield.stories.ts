import { fn } from '@storybook/test';

import type { Meta, StoryObj } from '@storybook/web-components';

import '../lib/components/button.component';
import { Textfield, type TextfieldProps } from 'src/stories/Textfield';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Example/Textfield',
  tags: ['autodocs'],
  render: (args) => Textfield(args),
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    label: {
      control: { type: 'text' },
    },
    value: {
      control: { type: 'text' },
    },
    type: {
      control: { type: 'select' },
      options: ['text'],
    },
  },
} satisfies Meta<TextfieldProps>;

export default meta;
type Story = StoryObj<TextfieldProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Simple: Story = {
  args: {
    label: 'Tekst input',
    value: 'great',
    type: 'text',
  },
};
