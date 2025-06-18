import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/helptext.component';
import { MinidHelptext } from '../components/helptext.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

type HelptextProps = Partial<{
  open: boolean;
  content: string;
  placement: MinidHelptext['placement'];
  hoist: boolean;
  size: MinidHelptext['size'];
  skidding: number;
  distance: number;
  'mid-show': unknown;
  'mid-hide': unknown;
  'mid-after-show': unknown;
  'mid-after-hide': unknown;
  '--': Slottable;
  '--max-width': string;
}>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Helptext',
  component: 'mid-helptext',
  argTypes: {
    size: {
      control: {
        type: 'radio',
      },
      options: ['sm', 'md', 'lg'],
    },
    placement: {
      control: {
        type: 'select',
      },
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'right',
        'right-start',
        'right-end',
        'left',
        'left-start',
        'left-end',
      ],
    },
    '--max-width': {
      type: 'string',
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
  },
} satisfies Meta<HelptextProps>;

export default meta;
type Story = StoryObj<HelptextProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    open: true,
    content:
      'Noen ganger kan vi alle behøve litt hjelp. Da er det fint å ha en hjelpsom hjelpetekst til å forklarer hva det er som egentlig foregår.',
  },
  parameters: {
    layout: 'centered',
  },
  decorators: (story) => html`<div class="m-44 flex">${story()}</div>`,
  render: ({
    open,
    content,
    placement,
    hoist,
    size,
    distance,
    skidding,
    '--max-width': maxWidth,
  }: HelptextProps) => {
    return html`<mid-helptext
      style="${styleMap({
        '--max-width': maxWidth,
      })}"
      ?open=${open}
      ?hoist=${hoist}
      size=${ifDefined(size)}
      placement=${ifDefined(placement)}
      distance=${ifDefined(distance)}
      skidding=${ifDefined(skidding)}
      >${content}
    </mid-helptext>`;
  },
};
