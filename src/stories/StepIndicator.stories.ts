import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/step-indicator.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type StepIndicatorProps = Partial<{
  steps: number;
  current: number;
}>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Step Indicator',
  component: 'mid-step-indicator',
  argTypes: {},
} satisfies Meta<StepIndicatorProps>;

export default meta;
type Story = StoryObj<StepIndicatorProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    steps: 4,
    current: 3,
  },
  render: ({ steps, current }: StepIndicatorProps) =>
    html`<mid-step-indicator
      steps="${ifDefined(steps)}"
      current="${ifDefined(current)}"
    ></mid-step-indicator>`,
};
