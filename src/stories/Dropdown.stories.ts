import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { Dropdown, type DropdownProps } from './Dropdown';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Dropdown',
  tags: ['autodocs'],
  render: (args) => Dropdown(args),
  component: 'Dropdown',
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    open: { type: 'boolean' },
    placement: {
      control: { type: 'select' },
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'right',
        'right-start',
        'right-end',
        'left',
        'left-start',
        'left-end',
      ],
    },
    distance: { type: 'number' },
    skidding: { type: 'number' },
    hoist: { type: 'boolean' },
  },

  subcomponents: {
    Menu: 'mid-menu',
    MenuItem: 'mid-menu-item',
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
  decorators: [(story) => html`<div class="m-56">${story()}</div>`],
  parameters: {
    layout: 'centered',
  },
};
