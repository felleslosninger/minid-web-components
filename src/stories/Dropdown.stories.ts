import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/button.component';
import '../components/dropdown.component';
import '../components/menu.component';
import '../components/menu-item.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MinidDropdown } from '../components/dropdown.component';
import { MidSelectEvent } from '../events/mid-select';

type DropdownProps = Partial<{
  open: boolean;
  size: MinidDropdown['size'];
  placement: MinidDropdown['placement'];
  sync: MinidDropdown['sync'];
  distance: number;
  skidding: number;
  hoist: boolean;
  arrow: boolean;
  trigger: unknown;
  panel: unknown;
  '--': unknown;
  click1: Function;
  click2: Function;
  select: (event: MidSelectEvent) => void;
}>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Dropdown',
  tags: ['autodocs'],
  component: 'mid-dropdown',
  argTypes: {
    size: {
      control: { type: 'radio' },
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
    sync: {
      control: {
        type: 'select',
      },
      options: ['width', 'height', 'both'],
    },
    trigger: { control: { disable: true } },
    panel: { control: { disable: true } },
    '--': { name: '-', control: { disable: true } },
  },
  args: {
    click1: () => {
      console.log('click 1');
    },
    click2: () => {
      console.log('click 2');
    },
    select: ({ detail: { item } }) => {
      console.log(item);
    },
  },

  parameters: {
    controls: {
      exclude: ['click1', 'click2', 'select'],
    },
  },
  subcomponents: {
    Menu: 'mid-menu',
    MenuItem: 'mid-menu-item',
  },
} satisfies Meta<DropdownProps>;

export default meta;
type Story = StoryObj<DropdownProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
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
    arrow,
    sync,
    click1,
    click2,
    select,
  }: DropdownProps) => html`
    <mid-dropdown
      ?open=${open}
      ?hoist=${hoist}
      ?arrow=${arrow}
      distance=${ifDefined(distance)}
      placement=${ifDefined(placement)}
      size=${ifDefined(size)}
      skidding=${ifDefined(skidding)}
      sync=${ifDefined(sync)}
      @mid-select=${select}
    >
      <mid-button slot="trigger"> Nedtrekk </mid-button>
      <mid-menu>
        <mid-menu-item href="https://www.google.com">
          google.com
        </mid-menu-item>
        <mid-menu-item @click=${click1}> Interessante ting </mid-menu-item>
        <mid-menu-item @click=${click2}> Logg ut </mid-menu-item>
      </mid-menu>
    </mid-dropdown>

    <script>
      var dropdown = document.querySelector('mid-dropdown');
    </script>
  `,
};
