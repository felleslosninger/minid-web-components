import type { Meta, StoryObj } from '@storybook/web-components';
import { Button, type ButtonProps } from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Button',
  tags: ['autodocs'],
  component: 'mid-button',
  render: (args) => Button(args),
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
    },
  },
  args: {
    label: 'Knapp',
    size: 'md',
    variant: 'primary',
    type: 'button',
    disabled: false,
  },
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<ButtonProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    label: 'Knapp',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Knapp',
    variant: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    label: 'Knapp',
    variant: 'tertiary',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Knapp',
  },
};

export const Encapsulated: Story = {
  args: {
    size: 'sm',
    variant: 'secondary',
    label: 'Knapp',
    fullWidth: true,
  },
};

export const Link: Story = {
  args: {
    label: 'Link',
    href: 'https://www.google.com',
    variant: 'tertiary',
  },
};
