import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/countdown.component';

const meta: Meta = {
  title: 'Komponenter/Countdown',
  component: 'mid-countdown',
  argTypes: {
    expiry: { control: 'date' },
    size: { control: 'number' },
    expired: { table: { disable: true } },
  },

  args: {
    expiry: Date.now() + 30 * 1000,
    size: 150,
  },
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: (args) =>
    html`<mid-countdown expiry=${args.expiry} size=${args.size}
      ><span>Ta-da!</span></mid-countdown
    >`,
};

export const WithSizeProp: Story = {
  render: (args) =>
    html`<mid-countdown expiry=${args.expiry} size=${args.size}
      ><span>I can't believe it's over already...</span></mid-countdown
    >`,
  args: {
    expiry: Date.now() + 145 * 1000,
    size: 100,
  },
};
