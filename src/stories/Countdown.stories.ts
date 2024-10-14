import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/countdown.component';

const meta: Meta = {
  title: 'Komponenter/Countdown',
  component: 'mid-countdown',

  argTypes: {
    expiry: {control: 'date'},
    size: {control: 'number'},
    expired: {table: {disable: true}},
  },
  // render: ({expiry, size}) => html`<mid-countdown expiry=${expiry} size=${size}></mid-countdown>`,
};

export default meta;
type Story = StoryObj;


export const WithSizeProp: Story = {
  render: ({timestamp, width}) => html`<mid-countdown expiry=${timestamp} size=${width}></mid-countdown>`,
  args: {
    timestamp: Date.now() + 145 * 1000,
    width: 150,
  }
};
