import { fn } from '@storybook/test';

import type { Meta, StoryObj } from '@storybook/web-components';

import { Button, type ButtonProps } from './Button';
import '../lib/components/button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Example/Button',
  tags: ['autodocs'],
  render: (args) => Button(args),
  argTypes: {
    size: {
      control: { type: 'select' },
      options: [undefined, 'small', 'medium', 'large'],
    },
    variant: {
      control: { type: 'select' },
      options: [undefined, 'primary', 'secondary', 'tertiary'],
    },
    encapsulated: {
      control: { type: 'boolean' },
    },
  },
  args: {
    onClick: fn(),
    encapsulated: false,
    label: 'Button',
    size: 'medium',
    variant: 'primary',
  },
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<ButtonProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Encapsulated: Story = {
  args: {
    size: 'small',
    label: 'Button',
    encapsulated: true,
  },
};
