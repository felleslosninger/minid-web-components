import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../components/spinner.component';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { expect } from 'storybook/test';

type SpinnerProps = Partial<{
  size: string;
  color: string;
  label: string;
}>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Spinner',
  tags: ['autodocs'],
  component: 'mid-spinner',
  argTypes: {
    size: {
      control: { type: 'text' },
    },
    color: {
      control: { type: 'color' },
    },
    label: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<SpinnerProps>;

export default meta;
type Story = StoryObj<SpinnerProps>;

const render = ({ size, color, label }: SpinnerProps) =>
  html`<mid-spinner
    label=${ifDefined(label)}
    style="${styleMap({
      'font-size': size,
      color,
    })}"
  ></mid-spinner>`;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    size: '4rem',
  },
  render,
};

export const WithLabel: Story = {
  args: {
    size: '4rem',
    label: 'Laster innhold',
  },
  render,
  play: async ({ canvasElement, args }) => {
    const spinner = canvasElement.querySelector('mid-spinner')!;
    const shadow = spinner.shadowRoot!;

    await expect(shadow.querySelector('.sr-only')).toHaveTextContent(
      args.label!
    );
    await expect(shadow.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  },
};

/**
 * With no `label` the spinner contributes nothing to the accessibility tree at
 * all — correct only when something else already conveys the loading state.
 */
export const Unlabelled: Story = {
  args: {
    size: '4rem',
  },
  render,
  play: async ({ canvasElement }) => {
    const shadow = canvasElement.querySelector('mid-spinner')!.shadowRoot!;

    await expect(shadow.querySelector('.sr-only')).not.toBeInTheDocument();
    await expect(shadow.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  },
};
