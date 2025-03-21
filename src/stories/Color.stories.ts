import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

export interface ColorProps {}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Styling/Color',
  argTypes: {},
} satisfies Meta<ColorProps>;

export default meta;
type Story = StoryObj<ColorProps>;

export const OverviewSubtle: Story = {
  decorators: [
    (story) =>
      html`<div
        class="grid auto-rows-[40px] grid-cols-5 gap-1 *:border-2 *:p-2"
      >
        ${story()}
      </div> `,
  ],
  render: () => html`
    <div class="bg-neutral-tinted border-neutral-subtle">
      <p class="text-neutral-subtle">Neutral</p>
    </div>
    <div class="bg-accent-tinted border-accent-subtle">
      <p class="text-accent-subtle">Accent</p>
    </div>
    <div class="bg-brand1-tinted border-brand1-subtle">
      <p class="text-brand1-subtle">Brand1</p>
    </div>
    <div class="bg-brand2-tinted border-brand2-subtle">
      <p class="text-brand2-subtle">Brand2</p>
    </div>
    <div class="bg-brand3-tinted border-brand3-subtle">
      <p class="text-brand3-subtle">Brand3</p>
    </div>
    <div class="bg-info-tinted border-info-subtle">
      <p class="text-info-subtle">Info</p>
    </div>
    <div class="bg-danger-tinted border-danger-subtle">
      <p class="text-danger-subtle">Danger</p>
    </div>
    <div class="bg-success-tinted border-success-subtle">
      <p class="text-success-subtle">Success</p>
    </div>
    <div class="bg-warning-tinted border-warning-subtle">
      <p class="text-warning-subtle">Warning</p>
    </div>
  `,
};

export const OverviewDefault: Story = {
  decorators: [
    (story) =>
      html`<div
        class="grid auto-rows-[40px] grid-cols-5 gap-1 *:border-2 *:p-2"
      >
        ${story()}
      </div> `,
  ],
  render: () => html`
    <div class="bg-neutral border-neutral">
      <p class="text-neutral">Neutral</p>
    </div>
    <div class="bg-accent border-accent">
      <p class="text-accent">Accent</p>
    </div>
    <div class="bg-brand1 border-brand1">
      <p class="text-brand1">Brand1</p>
    </div>
    <div class="bg-brand2 border-brand2">
      <p class="text-brand2">Brand2</p>
    </div>
    <div class="bg-brand3 border-brand3">
      <p class="text-brand3">Brand3</p>
    </div>
    <div class="bg-info border-info">
      <p class="text-info">Info</p>
    </div>
    <div class="bg-danger border-danger">
      <p class="text-danger">Danger</p>
    </div>
    <div class="bg-success border-success">
      <p class="text-success">Success</p>
    </div>
    <div class="bg-warning border-warning">
      <p class="text-warning">Warning</p>
    </div>
  `,
};

export const Base: Story = {
  decorators: [
    (story) =>
      html`<div class="grid auto-rows-[40px] grid-cols-5 gap-1">
        <p class="p-2">Default</p>
        <p class="p-2">Hover</p>
        <p class="p-2">Active</p>
        <p class="p-2">Contrast</p>
        <p class="p-2">Contrast subtle</p>
        ${story()}
      </div> `,
  ],
  render: () => html`
    <div class="bg-neutral-base"></div>
    <div class="bg-neutral-base-hover"></div>
    <div class="bg-neutral-base-active"></div>
    <div class="bg-neutral-base-contrast"></div>
    <div class="bg-neutral-base-contrast-subtle"></div>

    <div class="bg-accent-base"></div>
    <div class="bg-accent-base-hover"></div>
    <div class="bg-accent-base-active"></div>
    <div class="bg-accent-base-contrast"></div>
    <div class="bg-accent-base-contrast-subtle"></div>

    <div class="bg-brand1-base"></div>
    <div class="bg-brand1-base-hover"></div>
    <div class="bg-brand1-base-active"></div>
    <div class="bg-brand1-base-contrast"></div>
    <div class="bg-brand1-base-contrast-subtle"></div>

    <div class="bg-brand2-base"></div>
    <div class="bg-brand2-base-hover"></div>
    <div class="bg-brand2-base-active"></div>
    <div class="bg-brand2-base-contrast"></div>
    <div class="bg-brand2-base-contrast-subtle"></div>

    <div class="bg-brand3-base"></div>
    <div class="bg-brand3-base-hover"></div>
    <div class="bg-brand3-base-active"></div>
    <div class="bg-brand3-base-contrast"></div>
    <div class="bg-brand3-base-contrast-subtle"></div>

    <div class="bg-info-base"></div>
    <div class="bg-info-base-hover"></div>
    <div class="bg-info-base-active"></div>
    <div class="bg-info-base-contrast"></div>
    <div class="bg-info-base-contrast-subtle"></div>

    <div class="bg-danger-base"></div>
    <div class="bg-danger-base-hover"></div>
    <div class="bg-danger-base-active"></div>
    <div class="bg-danger-base-contrast"></div>
    <div class="bg-danger-base-contrast-subtle"></div>

    <div class="bg-success-base"></div>
    <div class="bg-success-base-hover"></div>
    <div class="bg-success-base-active"></div>
    <div class="bg-success-base-contrast"></div>
    <div class="bg-success-base-contrast-subtle"></div>

    <div class="bg-warning-base"></div>
    <div class="bg-warning-base-hover"></div>
    <div class="bg-warning-base-active"></div>
    <div class="bg-warning-base-contrast"></div>
    <div class="bg-warning-base-contrast-subtle"></div>
  `,
};

export const Surface: Story = {
  decorators: [
    (story) =>
      html`<div class="grid auto-rows-[40px] grid-cols-3 gap-1">
        <p class="p-2">Tinted</p>
        <p class="p-2">Hover</p>
        <p class="p-2">Active</p>
        ${story()}
      </div> `,
  ],
  render: () => html`
    <div class="bg-neutral-surface-tinted"></div>
    <div class="bg-neutral-surface-hover"></div>
    <div class="bg-neutral-surface-active"></div>

    <div class="bg-accent-surface-tinted"></div>
    <div class="bg-accent-surface-hover"></div>
    <div class="bg-accent-surface-active"></div>

    <div class="bg-brand1-surface-tinted"></div>
    <div class="bg-brand1-surface-hover"></div>
    <div class="bg-brand1-surface-active"></div>

    <div class="bg-brand2-surface-tinted"></div>
    <div class="bg-brand2-surface-hover"></div>
    <div class="bg-brand2-surface-active"></div>

    <div class="bg-brand3-surface-tinted"></div>
    <div class="bg-brand3-surface-hover"></div>
    <div class="bg-brand3-surface-active"></div>

    <div class="bg-info-surface-tinted"></div>
    <div class="bg-info-surface-hover"></div>
    <div class="bg-info-surface-active"></div>

    <div class="bg-danger-surface-tinted"></div>
    <div class="bg-danger-surface-hover"></div>
    <div class="bg-danger-surface-active"></div>

    <div class="bg-success-surface-tinted"></div>
    <div class="bg-success-surface-hover"></div>
    <div class="bg-success-surface-active"></div>

    <div class="bg-warning-surface-tinted"></div>
    <div class="bg-warning-surface-hover"></div>
    <div class="bg-warning-surface-active"></div>
  `,
};
