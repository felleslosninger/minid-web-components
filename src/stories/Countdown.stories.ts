import { Meta, StoryFn, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { Countdown, CountdownProps } from './Countdown';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Example/Countdown',
  tags: ['autodocs'],
  render: (args) => Countdown(args),
  argTypes: {
    expiry: {
      control: { type: 'number' },
    },
  },
  args: {},
} satisfies Meta<CountdownProps>;

export default meta;
type Story = StoryObj<CountdownProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    expiry: 10000,
  },
};

export const Count: StoryFn = () => {
  return html`<button class="btn">This is crazy dude</button>`;
};
