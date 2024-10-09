import type { Meta, StoryObj } from '@storybook/web-components';
import { Icon, type IconProps } from './Icon';
import { MidIconNameArray } from '../types/icon-name';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Icon',
  tags: ['autodocs'],
  component: 'mid-icon',
  render: (args) => Icon(args),
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
  args: {},
} satisfies Meta<IconProps>;

export default meta;
type Story = StoryObj<IconProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Simple: Story = {
  args: {
    name: 'books-fill',
    size: '4rem',
  },
};
