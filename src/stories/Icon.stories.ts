import type { Meta, StoryObj } from '@storybook/web-components';
import { MidIconName, MidIconNameArray } from '../types/icon-name';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../components/icon.component';

export interface IconProps {
  name: MidIconName;
  size?: string;
  fill?: string;
  stroke?: string;
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Icon',
  tags: ['autodocs'],
  component: 'mid-icon',
  argTypes: {
    name: {
      control: { type: 'select' },
      options: MidIconNameArray,
    },
    size: {
      control: { type: 'text' },
    },
    fill: { control: { type: 'color' } },
    stroke: { control: { type: 'color' } },
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
  render: ({ name, size, fill, stroke }: IconProps) =>
    html`<mid-icon
      fill=${ifDefined(fill)}
      stroke=${ifDefined(stroke)}
      size=${ifDefined(size)}
      name=${name}
    ></mid-icon>`,
};
