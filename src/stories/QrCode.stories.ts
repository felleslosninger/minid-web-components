import type { Meta, StoryObj } from '@storybook/web-components';
import '../components/qr-code.componet';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

type QrCodeProps = {
  content?: string;
  scale?: number;
  fill?: string;
  background?: string;
  margin?: number;
  label?: string;
  width?: number;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Qr Code',
  tags: ['autodocs'],
  component: 'mid-qr-code',
  argTypes: {
    fill: { control: { type: 'color' } },
    background: { control: { type: 'color' } },
    width: { type: 'number' },
  },
  parameters: {
    controls: {
      exclude: ['canvas'],
    },
  },
} satisfies Meta<QrCodeProps>;

export default meta;
type Story = StoryObj<QrCodeProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    content: 'https://minid.no/',
    label: 'link to MinID',
  },
  render: ({
    content,
    scale,
    fill,
    background,
    margin,
    label,
    width,
  }: QrCodeProps) =>
    html`<mid-qr-code
      width=${ifDefined(width)}
      label=${ifDefined(label)}
      margin=${ifDefined(margin)}
      content=${ifDefined(content)}
      scale=${ifDefined(scale)}
      fill=${ifDefined(fill)}
      background=${ifDefined(background)}
    ></mid-qr-code>`,
};
