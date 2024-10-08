import type { Meta, StoryObj } from '@storybook/web-components';
import { Icon, type IconProps } from './Icon';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Icon',
  tags: ['autodocs'],
  render: (args) => Icon(args),
  argTypes: {
    name: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {},
} satisfies Meta<IconProps>;

export default meta;
type Story = StoryObj<IconProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Simple: Story = {
  args: {
    name: 'Knapp',
  },
};
