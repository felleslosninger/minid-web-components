import type { Meta, StoryObj } from '@storybook/web-components';
import '../components/textfield.component';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

type TextfieldProps = {
  label?: string;
  value?: string;
  placeholder?: string;
  type?: 'text';
  size?: 'sm' | 'md' | 'lg';
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Textfield',
  tags: ['autodocs'],
  component: 'mid-textfield',
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    label: {
      control: { type: 'text' },
    },
    value: {
      control: { type: 'text' },
    },
    type: {
      control: { type: 'select' },
      options: ['text'],
    },
  },
} satisfies Meta<TextfieldProps>;

export default meta;
type Story = StoryObj<TextfieldProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    label: 'Tekst input',
    value: 'great',
    type: 'text',
  },
  render: ({ label, placeholder, size, type, value }: TextfieldProps) =>
    html`<mid-textfield
      label="${ifDefined(label)}"
      value=${ifDefined(value)}
      placeholder=${ifDefined(placeholder)}
      type=${ifDefined(type)}
      size=${ifDefined(size)}
    ></mid-textfield>`,
};
