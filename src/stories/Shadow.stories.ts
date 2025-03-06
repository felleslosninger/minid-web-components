import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

export interface ShadowProps {}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Styling/Shadow',
  argTypes: {},
} satisfies Meta<ShadowProps>;

export default meta;
type Story = StoryObj<ShadowProps>;

export const Shadows: Story = {
  decorators: [
    (story) =>
      html`<div class="grid auto-rows-[40px_60px] grid-cols-5 gap-x-4">
        <p class="p-2">shadow-xs</p>
        <p class="p-2">shadow-sm</p>
        <p class="p-2">shadow-md</p>
        <p class="p-2">shadow-lg</p>
        <p class="p-2">shadow-xl</p>
        ${story()}
      </div> `,
  ],
  render: () => html`
    <div class="shadow-xs"></div>
    <div class="shadow-sm"></div>
    <div class="shadow-md"></div>
    <div class="shadow-lg"></div>
    <div class="shadow-xl"></div>
  `,
};
