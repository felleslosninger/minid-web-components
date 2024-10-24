import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/tooltip.component';
import '../components/button.component';
import '../components/icon/icon.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MinidTooltip } from '../components/tooltip.component';

type TooltipProps = {
  trigger?: MinidTooltip['trigger'];
  contentString: string;
  open: boolean;
  hoist: boolean;
  disabled?: boolean;
  inverted: boolean;
  placement?: MinidTooltip['placement'];
  distance?: number;
  skidding?: number;
  content: unknown;
  base: unknown;
  '--': unknown;
  '--max-width': unknown;
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
    contentString: {
      name: 'content',
      description:
        'The text to render in the tooltip. If you need HTML you can use the content slot',
      control: { type: 'text' },
      table: { category: 'attributes' },
    },

    placement: {
      control: { type: 'select' },
      options: [
        'top',
        'top-start',
        'top-end',
        'right',
        'right-start',
        'right-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
      ],
    },
    content: {
      control: { disable: true },
    },
    base: {
      control: { disable: true },
    },
    '--': {
      name: '-',
      control: { disable: true },
    },
  },
} satisfies Meta<TooltipProps>;

export default meta;
type Story = StoryObj<TooltipProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    open: true,
    contentString:
      'Her er en liten tekst som liksom skal poppe opp når du tar musa di over trigger objektet',
  },
  parameters: {
    layout: 'centered',
  },
  decorators: (story) => html`<div class="m-24 flex">${story()}</div>`,
  render: ({
    open,
    contentString,
    hoist,
    inverted,
    trigger,
    placement,
    disabled,
    distance,
    skidding,
  }: TooltipProps) => {
    return html`<mid-tooltip
      ?open=${open}
      ?hoist=${hoist}
      ?disabled=${disabled}
      ?inverted=${inverted}
      trigger=${ifDefined(trigger)}
      placement=${ifDefined(placement)}
      content=${ifDefined(contentString)}
      distance=${ifDefined(distance)}
      skidding=${ifDefined(skidding)}
    >
      <mid-button variant="secondary"> Trigger </mid-button>
    </mid-tooltip>`;
  },
};
