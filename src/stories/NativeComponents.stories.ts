import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

export interface NativeComponentProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Styling/Native Components',
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: 'The variant of the button',
    },
  },
} satisfies Meta<NativeComponentProps>;

export default meta;
type Story = StoryObj<NativeComponentProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Button: Story = {
  args: {},
  decorators: [
    (story) => html`<div class="grid grid-cols-4 gap-2">${story()}</div>`,
  ],
  render: () => html`
    <button class="mid-button">Knapp</button>
    <a href="#" class="mid-button">Link</a>
    <button class="mid-button bg-danger-base">Knapp</button>
    <button class="mid-button border-success-base text-success bg-transparent">
      Knapp
    </button>
  `,
};

export const Input: Story = {
  args: {},
  render: () =>
    html`<label for="input-1" class="mid-label mb-2"> Input </label>
      <input id="input-1" class="mid-input" /> `,
};
