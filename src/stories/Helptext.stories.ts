import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/helptext.component';
import { MinidHelptext } from '../components/helptext.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type HelptextProps = {
  open?: boolean;
  content?: string;
  placement?: MinidHelptext['placement'];
  hoist?: boolean;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Helptext',
  component: 'mid-helptext',
  argTypes: {
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
  },
} satisfies Meta<HelptextProps>;

export default meta;
type Story = StoryObj<HelptextProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    content:
      'Noen ganger i livet kan vi alle behøve litt hjelp. Da er det fint å ha en hjelpsom hjelpetekst til å forklarer hva det er som egentlig foregår.',
  },
  parameters: {
    layout: 'centered',
  },
  decorators: (story) => html`<div class="m-24 flex">${story()}</div>`,
  render: ({ open, content, placement, hoist }: HelptextProps) => {
    return html`<mid-helptext
      ?hoist=${hoist}
      placement=${ifDefined(placement)}
      ?open=${open}
      >${content}
    </mid-helptext>`;
  },
};
