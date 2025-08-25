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
    html`<label for="input-1" class="mid-label mb-2"> Input </label>
      <input id="input-1" class="mid-input" /> `,
};
