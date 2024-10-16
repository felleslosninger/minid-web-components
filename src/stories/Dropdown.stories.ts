import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/button.component';
import '../components/dropdown.component';
import '../components/menu.component';
import '../components/menu-item.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MinidDropdown } from '../components/dropdown.component';

export interface DropdownProps {
  open?: boolean;
  size?: MinidDropdown['size'];
  placement?: MinidDropdown['placement'];
  distance?: number;
  skidding?: number;
  hoist?: boolean;
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Dropdown',
  tags: ['autodocs'],
  component: 'mid-dropdown',
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
    open: true,
  },
  decorators: [(story) => html`<div class="m-56">${story()}</div>`],
  parameters: {
    layout: 'centered',
  },
  render: ({
    open,
    distance,
    hoist,
    placement,
    size,
    skidding,
  }: DropdownProps) =>
    html`<mid-dropdown
      ?open=${open}
      ?hoist=${hoist}
      distance=${ifDefined(distance)}
      placement=${ifDefined(placement)}
      size=${ifDefined(size)}
      skidding=${ifDefined(skidding)}
    >
      <mid-button slot="trigger"> Nedtrekk </mid-button>
      <mid-menu>
        <mid-menu-item href="https://www.google.com">
          google.com
        </mid-menu-item>
        <mid-menu-item @click=${click1}> Interessante ting </mid-menu-item>
        <mid-menu-item @click=${click2}> Logg ut </mid-menu-item>
      </mid-menu>
    </mid-dropdown>`,
};

const click1 = () => {
  console.log('click 1');
};

const click2 = () => {
  console.log('click 2');
};
