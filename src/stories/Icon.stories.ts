import type { Meta, StoryObj } from '@storybook/web-components';
import { MidIconName } from '../types/icon-name';
import { html } from 'lit';
import '../components/icon/icon.component';
import { styleMap } from 'lit/directives/style-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export interface IconProps {
  name: MidIconName;
  size?: string;
  color?: string;
  alt?: string;
  src?: string;
  'mid-error'?: unknown;
  'mid-load'?: unknown;
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Icon',
  tags: ['autodocs'],
  component: 'mid-icon',
  argTypes: {
    name: {
      control: { type: 'text' },
    },
    size: {
      control: { type: 'text' },
    },
    alt: {
      control: { type: 'text' },
    },
    src: {
      control: { type: 'text' },
    },

    color: { control: { type: 'color' } },
    'mid-error': { control: { disable: true } },
    'mid-load': { control: { disable: true } },
  },
} satisfies Meta<IconProps>;

export default meta;
type Story = StoryObj<IconProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    name: 'books-fill',
    size: '4rem',
  },
  render: ({ name, size, color, alt }: IconProps) =>
    html`<mid-icon
      style="${styleMap({
        color: color,
        'font-size': size,
      })}"
      name=${name}
      alt=${ifDefined(alt)}
    ></mid-icon>`,
};
