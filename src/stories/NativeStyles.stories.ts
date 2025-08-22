import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

export interface NativeStyleProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Styling/Native Styles',
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: 'The variant of the button',
    },
  },
} satisfies Meta<NativeStyleProps>;

export default meta;
type Story = StoryObj<NativeStyleProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Button: Story = {
  args: {},
  render: () => html` <button class="mid-button">Knapp</button> `,
};

export const Input: Story = {
  args: {},
  render: () =>
    html`<label for="data" class="mid-label"> Input: </label>
      <input id="data" class="mid-input" /> `,
};
