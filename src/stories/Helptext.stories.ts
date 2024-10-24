import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/helptext.component';

type HelptextProps = {};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Helptext',
  component: 'mid-helptext',
  argTypes: {},
} satisfies Meta<HelptextProps>;

export default meta;
type Story = StoryObj<HelptextProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {},
  parameters: {
    layout: 'centered',
  },
  decorators: (story) => html`<div class="m-24 flex">${story()}</div>`,
  render: (props: HelptextProps) => {
    return html`<mid-helptext> </mid-helptext>`;
  },
};
