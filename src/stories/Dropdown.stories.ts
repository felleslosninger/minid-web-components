import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { Dropdown, type DropdownProps } from 'src/stories/Dropdown';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Example/Dropdown',
  tags: ['autodocs'],
  render: (args) => Dropdown(args),
  component: 'mid-dropdown',
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },

  subcomponents: {
    Menu: 'mid-menu',
    MenuItem: 'mid-menu-item',
    button: 'mid-button',
  },
} satisfies Meta<DropdownProps>;

export default meta;
type Story = StoryObj<DropdownProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Simple: Story = {
  args: {
    size: 'md',
    open: true,
  },
  decorators: [(story) => html`<div class="m-56 mt-0">${story()}</div>`],
  parameters: {
    layout: 'centered',
  },
};
