import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/button.component';

const meta: Meta = {
  title: 'Komponenter/Button2',
  component: 'mid-button',
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: (args) => html`
    <mid-button variant="${args.variant}">
      <slot>Click me!</slot> 
    </mid-button>
  `,
  args: {
    variant: 'primary',
  },
};

export const WithProp: Story = {
  render: () => html`
    <mid-button variant="primary">Hello World!</mid-button>`,
};