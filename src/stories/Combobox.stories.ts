import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/combobox.component';
import '../components/menu.component';
import '../components/menu-item.component';
import '../components/textfield.component';

type ComboboxProps = Partial<{
  open: boolean;
  stayopenonselect: boolean;
}>;

const meta: Meta = {
  title: 'Komponenter/Under arbeid/Combobox',
  component: 'mid-combobox',
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;

type Story = StoryObj<ComboboxProps>;

export const Main: Story = {
  args: {
    open: true,
    stayopenonselect: true,
  },
  decorators: [
    (story) =>
      html`<div class="mb-64">
        ${story()}
        <pre class="pre"></pre>
      </div>`,
  ],
  render: ({ open, stayopenonselect }: ComboboxProps) => html`
    <mid-combobox
      ?open=${open}
      ?stayopenonselect=${stayopenonselect}
      sync="width"
    >
      <mid-textfield slot="trigger"></mid-textfield>
      <mid-menu>
        <mid-menu-item value="value"> Label </mid-menu-item>
        <mid-menu-item value="value"> Label </mid-menu-item>
        <mid-menu-item value="value"> Label </mid-menu-item>
      </mid-menu>
    </mid-combobox>
  `,
};
