import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/button.component';

import { MinidButton } from '../components/button.component';

const meta: Meta<typeof MinidButton> = {
  title: 'Komponenter/Button2',
  component: 'mid-button',

  args: {
    variant: 'primary',
  },

  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
  },

};

export default meta;

type Story = StoryObj<typeof MinidButton>;

export const Primary: Story = {

  render: (args) => html`
    <mid-button variant="${args.variant}">
      <slot>Click me!</slot> 
    </mid-button>
  `,


};

export const WithProp: Story = {
  render: () => html`
    <mid-button variant="primary">Hello World!</mid-button>`,
};