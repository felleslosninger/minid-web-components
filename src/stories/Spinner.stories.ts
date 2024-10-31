import type { Meta, StoryObj } from '@storybook/web-components';
import '../components/spinner.component';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

type SpinnerProps = {
  size?: string;
  color?: string;
};

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
  },
} satisfies Meta<SpinnerProps>;

export default meta;
type Story = StoryObj<SpinnerProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    size: '4rem',
  },
  render: ({ size, color }: SpinnerProps) =>
    html`<mid-spinner
      style="${styleMap({
        'font-size': size,
        color,
      })}"
    ></mid-spinner>`,
};
