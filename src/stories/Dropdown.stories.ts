import type { Meta, StoryObj } from '@storybook/web-components';

import '../lib/components/button.component';
import { Dropdown, type DropdownProps } from 'src/stories/Dropdown';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Example/Dropdown',
  tags: ['autodocs'],
  render: (args) => Dropdown(args),
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
} satisfies Meta<DropdownProps>;

export default meta;
type Story = StoryObj<DropdownProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Simple: Story = {
  args: {
    label: 'Tekst input',
    value: 'great',
    type: 'text',
  },
};
