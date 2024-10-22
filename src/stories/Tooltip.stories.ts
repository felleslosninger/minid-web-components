import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/tooltip.component';
import '../components/button.component';
import '../components/icon/icon.component';

type TooltipProps = {
  // trigger: MinidTooltip['trigger'];
  content: string;
  open: boolean;
  hoist: boolean;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Tooltip',
  component: 'mid-tooltip',
  argTypes: {},
} satisfies Meta<TooltipProps>;

export default meta;
type Story = StoryObj<TooltipProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {
    open: true,
    content:
      'Her er en liten tekst som liksom skal poppe opp når du tar musa over trigger objektet',
  },
  parameters: { layout: 'centered' },
  decorators: (story) => html`<div class="flex">${story()}</div>`,
  render: ({ open, content, hoist }: TooltipProps) => {
    return html`<mid-tooltip ?open=${open} ?hoist=${hoist}>
      <mid-button variant="secondary"> mus over her </mid-button>
      <div class="w-44" slot="content">${content}</div>
    </mid-tooltip>`;
  },
};
