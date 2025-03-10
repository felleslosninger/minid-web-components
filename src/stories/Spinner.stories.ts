import type { Meta, StoryObj } from '@storybook/web-components';
import '../components/spinner.component';
import { html } from 'lit';
import { MinidSpinner } from '../components/spinner.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type SpinnerProps = {
  'data-size'?: MinidSpinner['size'];
  'data-color'?: MinidSpinner['color'];
  size: undefined;
  color: undefined;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Spinner',
  tags: ['autodocs'],
  component: 'mid-spinner',
  argTypes: {
    'data-color': {
      type: 'string',
      control: { type: 'select' },
      options: [
        'neutral',
        'accent',
        'brand1',
        'brand2',
        'brand3',
        'info',
        'warning',
        'danger',
      ],
    },
    'data-size': {
      control: { type: 'radio' },
      options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    size: { table: { disable: true } },
    color: { type: 'string', table: { disable: true } },
  },
} satisfies Meta<SpinnerProps>;

export default meta;
type Story = StoryObj<SpinnerProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {},
  render: ({ 'data-size': size, 'data-color': color }: SpinnerProps) =>
    html`<mid-spinner
      data-color=${ifDefined(color)}
      data-size="${ifDefined(size)}"
    ></mid-spinner>`,
};
