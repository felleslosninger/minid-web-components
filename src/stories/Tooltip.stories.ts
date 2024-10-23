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
  content: unknown;
  open: boolean;
  hoist: boolean;
  placement?: MinidTooltip['placement'];
  disabled?: boolean;
  base: unknown;
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
  parameters: { layout: 'centered' },
  decorators: (story) => html`<div class="m-24 flex">${story()}</div>`,
  render: ({
    open,
    contentString,
    hoist,
    trigger,
    placement,
    disabled,
  }: TooltipProps) => {
    return html`<mid-tooltip
      ?open=${open}
      ?hoist=${hoist}
      ?disabled=${disabled}
      trigger=${ifDefined(trigger)}
      placement=${ifDefined(placement)}
      content=${ifDefined(contentString)}
    >
      <mid-button variant="tertiary" iconstyled>
        <mid-icon class="text-2xl" name="information-square"></mid-icon>
      </mid-button>
    </mid-tooltip>`;
  },
};
