import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/helptext.component';

type HelptextProps = {
  open?: boolean;
  content?: string;
};

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
  args: {
    content:
      'Noen ganger i livet kan vi alle behøve litt hjelp. Da er det fint å ha en hjelpsom hjelpetekst til å forklarer hva det er som egentlig foregår.',
  },
  parameters: {
    layout: 'centered',
  },
  decorators: (story) => html`<div class="m-24 flex">${story()}</div>`,
  render: ({ open, content }: HelptextProps) => {
    return html`<mid-helptext ?open=${open}>${content}</mid-helptext>`;
  },
};
