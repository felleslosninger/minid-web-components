import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/checkbox.component';

const meta: Meta = {
  title: 'Komponenter/Checkbox',
  component: 'mid-checkbox',
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: (args) => html`
    <mid-checkbox variant="${args.variant}"> hello </mid-checkbox>
  `,
  args: {
    variant: 'primary',
  },
};

export const WithProp: Story = {
  render: () =>
    html` <mid-checkbox variant="primary">Hello World!</mid-checkbox>`,
};
