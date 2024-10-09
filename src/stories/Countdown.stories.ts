import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/countdown.component';

const meta: Meta = {
  title: 'Komponenter/Countdown',
  component: 'mid-countdown',
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  args: {
    expiry: Date.now() + 30 * 1000,
    ding: true,
  },
};

export const WithProp: Story = {
  render: () => html`
    <mid-countdown 
      expiry=${Date.now() + 100 * 1000} 
      size="350"
    >
    </mid-countdown>`,
};