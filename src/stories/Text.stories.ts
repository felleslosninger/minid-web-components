import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

export interface TextProps {}

const meta = {
  title: 'Styling/Text',
} satisfies Meta<TextProps>;

export default meta;
type Story = StoryObj<TextProps>;

export const BodyDefault: Story = {
  render: () => html`
    <p class="text-body-xs">Hello on you</p>
    <p class="text-body-sm">Hello on you</p>
    <p class="text-body-md">Hello on you</p>
    <p class="text-body-lg">Hello on you</p>
    <p class="text-body-xl">Hello on you</p>
  `,
};

export const BodyLong: Story = {
  render: () => html`
    <p class="text-body-long-xs">Hello on you</p>
    <p class="text-body-long-sm">Hello on you</p>
    <p class="text-body-long-md">Hello on you</p>
    <p class="text-body-long-lg">Hello on you</p>
    <p class="text-body-long-xl">Hello on you</p>
  `,
};

export const BodyShort: Story = {
  render: () => html`
    <p class="text-body-short-xs">Hello on you</p>
    <p class="text-body-short-sm">Hello on you</p>
    <p class="text-body-short-md">Hello on you</p>
    <p class="text-body-short-lg">Hello on you</p>
    <p class="text-body-short-xl">Hello on you</p>
  `,
};

export const HeadingDefault: Story = {
  render: () => html`
    <h6 class="text-heading-2xs">Hello on you</h6>
    <h6 class="text-heading-xs">Hello on you</h6>
    <h5 class="text-heading-sm">Hello on you</h5>
    <h4 class="text-heading-md">Hello on you</h4>
    <h3 class="text-heading-lg">Hello on you</h3>
    <h2 class="text-heading-xl">Hello on you</h2>
    <h1 class="text-heading-2xl">Hello on you</h1>
  `,
};
