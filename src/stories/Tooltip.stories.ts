import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/tooltip.component';
import '../components/button.component';
import '../components/icon/icon.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MinidTooltip } from '../components/tooltip.component';

type TooltipProps = {
  trigger?: MinidTooltip['trigger'];
  content: string;
  open: boolean;
  hoist: boolean;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Tooltip',
  component: 'mid-tooltip',
  argTypes: {
    trigger: {
      control: { type: 'select' },
      options: ['focus hover', 'hover', 'focus', 'click', 'manual'],
    },
  },
} satisfies Meta<TooltipProps>;

export default meta;
type Story = StoryObj<TooltipProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    content:
      'Her er en liten tekst som liksom skal poppe opp når du tar musa di over trigger objektet',
  },
  parameters: { layout: 'centered' },
  decorators: (story) => html`<div class="m-24 flex">${story()}</div>`,
  render: ({ open, content, hoist, trigger }: TooltipProps) => {
    return html`<mid-tooltip
      ?open=${open}
      ?hoist=${hoist}
      trigger=${ifDefined(trigger)}
    >
      <mid-button variant="tertiary" iconstyled>
        <mid-icon class="text-2xl" name="information-square"></mid-icon>
      </mid-button>
      <div slot="content">${content}</div>
    </mid-tooltip>`;
  },
};
