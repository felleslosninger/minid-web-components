import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import 'components/minid-countdown';


const meta: Meta = {
  title: 'Komponenter/Countdown',
  tags: ['autodocs'],
  component: 'minid-countdown',
  decorators: [(story) => html`<div style="margin: 3em">${story()}</div>`],
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  args: {
    expiry: Date.now() + 30 * 1000,
  },
};

export const WithProp: Story = {
  render: () => html`
    <minid-countdown 
      expiry=${Date.now() + 100 * 1000} 
      size="350"
    >
    </minid-countdown>`,
};