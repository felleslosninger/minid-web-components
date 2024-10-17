import type { Meta, StoryObj } from '@storybook/web-components';
import '../components/spinner.component';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

type SpinnerProps = {
  size?: string;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Spinner',
  tags: ['autodocs'],
  component: 'mid-spinner',
} satisfies Meta<SpinnerProps>;

export default meta;
type Story = StoryObj<SpinnerProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  render: ({ size }: SpinnerProps) =>
    html`<mid-spinner size=${ifDefined(size)}></mid-spinner>`,
};
