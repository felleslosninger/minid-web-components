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

export const Global: Story = {
  decorators: [
    (story) =>
      html`<div class="grid auto-rows-[40px] grid-cols-15 gap-1">
        <p class="p-2">1</p>
        <p class="p-2">2</p>
        <p class="p-2">3</p>
        <p class="p-2">4</p>
        <p class="p-2">5</p>
        <p class="p-2">6</p>
        <p class="p-2">7</p>
        <p class="p-2">8</p>
        <p class="p-2">9</p>
        <p class="p-2">10</p>
        <p class="p-2">11</p>
        <p class="p-2">12</p>
        <p class="p-2">13</p>
        <p class="p-2">C 1</p>
        <p class="p-2">C 2</p>
        ${story()}
      </div> `,
  ],
  render: () => html`
    <div class="bg-blue-1"></div>
    <div class="bg-blue-2"></div>
    <div class="bg-blue-3"></div>
    <div class="bg-blue-4"></div>
    <div class="bg-blue-5"></div>
    <div class="bg-blue-6"></div>
    <div class="bg-blue-7"></div>
    <div class="bg-blue-8"></div>
    <div class="bg-blue-9"></div>
    <div class="bg-blue-10"></div>
    <div class="bg-blue-11"></div>
    <div class="bg-blue-12"></div>
    <div class="bg-blue-13"></div>
    <div class="bg-blue-contrast-1"></div>
    <div class="bg-blue-contrast-2"></div>

    <div class="bg-green-1"></div>
    <div class="bg-green-2"></div>
    <div class="bg-green-3"></div>
    <div class="bg-green-4"></div>
    <div class="bg-green-5"></div>
    <div class="bg-green-6"></div>
    <div class="bg-green-7"></div>
    <div class="bg-green-8"></div>
    <div class="bg-green-9"></div>
    <div class="bg-green-10"></div>
    <div class="bg-green-11"></div>
    <div class="bg-green-12"></div>
    <div class="bg-green-13"></div>
    <div class="bg-green-contrast-1"></div>
    <div class="bg-green-contrast-2"></div>

    <div class="bg-orange-1"></div>
    <div class="bg-orange-2"></div>
    <div class="bg-orange-3"></div>
    <div class="bg-orange-4"></div>
    <div class="bg-orange-5"></div>
    <div class="bg-orange-6"></div>
    <div class="bg-orange-7"></div>
    <div class="bg-orange-8"></div>
    <div class="bg-orange-9"></div>
    <div class="bg-orange-10"></div>
    <div class="bg-orange-11"></div>
    <div class="bg-orange-12"></div>
    <div class="bg-orange-13"></div>
    <div class="bg-orange-contrast-1"></div>
    <div class="bg-orange-contrast-2"></div>

    <div class="bg-purple-1"></div>
    <div class="bg-purple-2"></div>
    <div class="bg-purple-3"></div>
    <div class="bg-purple-4"></div>
    <div class="bg-purple-5"></div>
    <div class="bg-purple-6"></div>
    <div class="bg-purple-7"></div>
    <div class="bg-purple-8"></div>
    <div class="bg-purple-9"></div>
    <div class="bg-purple-10"></div>
    <div class="bg-purple-11"></div>
    <div class="bg-purple-12"></div>
    <div class="bg-purple-13"></div>
    <div class="bg-purple-contrast-1"></div>
    <div class="bg-purple-contrast-2"></div>

    <div class="bg-red-1"></div>
    <div class="bg-red-2"></div>
    <div class="bg-red-3"></div>
    <div class="bg-red-4"></div>
    <div class="bg-red-5"></div>
    <div class="bg-red-6"></div>
    <div class="bg-red-7"></div>
    <div class="bg-red-8"></div>
    <div class="bg-red-9"></div>
    <div class="bg-red-10"></div>
    <div class="bg-red-11"></div>
    <div class="bg-red-12"></div>
    <div class="bg-red-13"></div>
    <div class="bg-red-contrast-1"></div>
    <div class="bg-red-contrast-2"></div>

    <div class="bg-yellow-1"></div>
    <div class="bg-yellow-2"></div>
    <div class="bg-yellow-3"></div>
    <div class="bg-yellow-4"></div>
    <div class="bg-yellow-5"></div>
    <div class="bg-yellow-6"></div>
    <div class="bg-yellow-7"></div>
    <div class="bg-yellow-8"></div>
    <div class="bg-yellow-9"></div>
    <div class="bg-yellow-10"></div>
    <div class="bg-yellow-11"></div>
    <div class="bg-yellow-12"></div>
    <div class="bg-yellow-13"></div>
    <div class="bg-yellow-contrast-1"></div>
    <div class="bg-yellow-contrast-2"></div>
  `,
};
