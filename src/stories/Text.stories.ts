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

export const TextColor: Story = {
  decorators: [
    (story) =>
      html`<div class="grid auto-rows-[40px] grid-cols-5 gap-1">
        ${story()}
      </div> `,
  ],
  render: () => html`
    <p class="text-neutral">Neutral</p>
    <p class="text-accent">Accent</p>
    <p class="text-brand1">Brand1</p>
    <p class="text-brand2">Brand2</p>
    <p class="text-brand3">Brand3</p>
    <p class="text-info">Info</p>
    <p class="text-danger">Danger</p>
    <p class="text-success">Success</p>
    <p class="text-warning">Warning</p>
  `,
};

export const TextColorSubtle: Story = {
  decorators: [
    (story) =>
      html`<div class="grid auto-rows-[40px] grid-cols-5 gap-1">
        ${story()}
      </div> `,
  ],
  render: () => html`
    <p class="text-neutral-subtle">Neutral</p>
    <p class="text-accent-subtle">Accent</p>
    <p class="text-brand1-subtle">Brand1</p>
    <p class="text-brand2-subtle">Brand2</p>
    <p class="text-brand3-subtle">Brand3</p>
    <p class="text-info-subtle">Info</p>
    <p class="text-danger-subtle">Danger</p>
    <p class="text-success-subtle">Success</p>
    <p class="text-warning-subtle">Warning</p>
  `,
};
