import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/input.component.js';

export interface FormControlProps {}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Form Controls',
  argTypes: {},
} satisfies Meta<FormControlProps>;

export default meta;
type Story = StoryObj<FormControlProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {},
  render: () => html`<mid-input></mid-input>`,
};
