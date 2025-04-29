import type { Meta, StoryObj } from '@storybook/web-components';
import { html, nothing, Part } from 'lit';
import '../components/tooltip.component';
import '../components/button.component';
import '../components/icon/icon.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MinidTooltip } from '../components/tooltip.component';
import { styleMap } from 'lit/directives/style-map.js';

type TooltipProps = Partial<{
  trigger: MinidTooltip['trigger'];
  contentString: string;
  open: boolean;
  hoist: boolean;
  disabled: boolean;
  inverted: boolean;
  placement: MinidTooltip['placement'];
  size: MinidTooltip['size'];
  distance: number;
  skidding: number;
  show: Function;
  hide: Function;
  '--': Slottable;
  content: Slottable;
  base: Part;
  body: Part;
  'mid-show': Event;
  'mid-hide': Event;
  'mid-after-show': Event;
  'mid-after-hide': Event;
  '--max-width': string;
  '--hide-delay': string;
  '--show-delay': string;
}>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Tooltip',
  component: 'mid-tooltip',
  argTypes: {
    trigger: {
      control: { type: 'select' },
      options: [
        'focus hover',
        'focus click',
        'hover',
        'focus',
        'click',
        'manual',
      ],
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
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    '--max-width': {
      type: 'string',
    },
    '--hide-delay': {
      type: 'string',
    },
    '--show-delay': {
      type: 'string',
    },
    content: {
      type: 'string',
    },
    base: {
      control: { disable: true },
    },
    body: {
      control: { disable: true },
    },
    'mid-after-hide': {
      control: { disable: true },
    },
    'mid-hide': {
      control: { disable: true },
    },
    'mid-show': {
      control: { disable: true },
    },
    'mid-after-show': {
      control: { disable: true },
    },
    '--': {
      name: '-',
      control: { disable: true },
    },
    show: {
      control: false,
      table: { category: 'Methods' },
      type: 'function',
      description: 'Shows the tooltip.',
    },
    hide: {
      control: false,
      table: { category: 'Methods' },
      type: 'function',
      description: 'Hides the tooltip',
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
      'Her er en liten tekst som liksom skal poppe opp hvis du har musa di over trigger objektet',
  },
  parameters: {
    layout: 'centered',
  },
  decorators: (story) => html`<div class="m-24 flex">${story()}</div>`,
  render: ({
    open,
    contentString,
    content,
    hoist,
    inverted,
    trigger,
    placement,
    size,
    disabled,
    distance,
    skidding,
    '--max-width': maxWidth,
    '--show-delay': showDelay,
    '--hide-delay': hideDelay,
  }: TooltipProps) => {
    return html`<mid-tooltip
      style="${styleMap({
        '--max-width': maxWidth,
        '--show-delay': showDelay,
        '--hide-delay': hideDelay,
      })}"
      ?open=${open}
      ?hoist=${hoist}
      ?disabled=${disabled}
      ?inverted=${inverted}
      trigger=${ifDefined(trigger)}
      placement=${ifDefined(placement)}
      size=${ifDefined(size)}
      content=${ifDefined(content ? undefined : contentString)}
      distance=${ifDefined(distance)}
      skidding=${ifDefined(skidding)}
    >
      <mid-button variant="secondary"> Trigger </mid-button>
      ${!content ? nothing : html`<span slot="content">${content}</span>`}
    </mid-tooltip>`;
  },
};
