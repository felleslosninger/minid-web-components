import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

export interface TextProps {}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Styling/Setup',
  argTypes: {},
} satisfies Meta<TextProps>;

export default meta;
type Story = StoryObj<TextProps>;

export const BodyDefault: Story = {
  args: {},
  render: () => html`
    <p class="text-body-xs">Hello on you</p>
    <p class="text-body-sm">Hello on you</p>
    <p class="text-body-md">Hello on you</p>
    <p class="text-body-lg">Hello on you</p>
    <p class="text-body-xl">Hello on you</p>
  `,
};
