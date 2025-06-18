import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

export interface BorderProps {}

const meta = {
  title: 'Styling/Border',
} satisfies Meta<BorderProps>;

export default meta;
type Story = StoryObj<BorderProps>;

export const BorderWidth: Story = {
  decorators: [
    (story) =>
      html`<div class="grid auto-rows-[60px] grid-cols-3 gap-4 *:p-4">
        ${story()}
      </div> `,
  ],
  render: () => html`
    <div class="border">border</div>
    <div class="border-focus">border-focus</div>
  `,
};

export const BorderColor: Story = {
  decorators: [
    (story) =>
      html`<div class="grid auto-rows-[60px] grid-cols-5 gap-4 *:p-2">
        ${story()}
      </div> `,
  ],
  render: () => html`
    <div class="border-focus border-neutral">border-neutral</div>
    <div class="border-focus border-accent">border-accent</div>
    <div class="border-focus border-brand1">border-brand1</div>
    <div class="border-focus border-brand2">border-brand2</div>
    <div class="border-focus border-brand3">border-brand3</div>
    <div class="border-focus border-info">border-info</div>
    <div class="border-focus border-danger">border-danger</div>
    <div class="border-focus border-success">border-success</div>
    <div class="border-focus border-warning">border-warning</div>
  `,
};
export const BorderColorSubtle: Story = {
  decorators: [
    (story) =>
      html`<div class="grid auto-rows-[60px] grid-cols-4 gap-4 *:p-2">
        ${story()}
      </div> `,
  ],
  render: () => html`
    <div class="border-focus border-neutral-subtle">border-neutral-subtle</div>
    <div class="border-focus border-accent-subtle">border-accent-subtle</div>
    <div class="border-focus border-brand1-subtle">border-brand1-subtle</div>
    <div class="border-focus border-brand2-subtle">border-brand2-subtle</div>
    <div class="border-focus border-brand3-subtle">border-brand3-subtle</div>
    <div class="border-focus border-info-subtle">border-info-subtle</div>
    <div class="border-focus border-danger-subtle">border-danger-subtle</div>
    <div class="border-focus border-success-subtle">border-success-subtle</div>
    <div class="border-focus border-warning-subtle">border-warning-subtle</div>
  `,
};

export const BorderRadius: Story = {
  decorators: [
    (story) =>
      html`<div class="grid auto-rows-[60px] grid-cols-3 gap-4 *:border *:p-4">
        ${story()}
      </div> `,
  ],
  render: () => html`
    <div class="rounded-sm">rounded-sm</div>
    <div class="rounded">rounded</div>
    <div class="rounded-md">rounded-md</div>
    <div class="rounded-lg">rounded-lg</div>
    <div class="rounded-xl">rounded-xl</div>
    <div class="rounded-full">rounded-full</div>
  `,
};
