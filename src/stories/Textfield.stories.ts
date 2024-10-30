import type { Meta, StoryObj } from '@storybook/web-components';
import '../components/textfield.component';
import '../components/icon/icon.component';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

type TextfieldProps = {
  label?: string;
  value?: string;
  placeholder?: string;
  type?: 'text';
  size?: 'sm' | 'md' | 'lg';
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  description?: string;
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
      options: ['text', 'number'],
    },
  },
  parameters: {
    controls: {
      exclude: ['input'],
    },
  },
} satisfies Meta<TextfieldProps>;

export default meta;
type Story = StoryObj<TextfieldProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    label: 'Tekst input',

    type: 'text',
  },
  render: ({
    label,
    placeholder,
    size,
    type,
    value,
    prefix,
    suffix,
    disabled,
    description,
  }: TextfieldProps) =>
    html`<mid-textfield
      ?disabled=${disabled}
      description=${ifDefined(description)}
      label="${ifDefined(label)}"
      value=${ifDefined(value)}
      placeholder=${ifDefined(placeholder)}
      type=${ifDefined(type)}
      size=${ifDefined(size)}
    >
      ${prefix
        ? html`<span slot="prefix">${prefix}</span>`
        : html`
            <mid-icon class="text-3xl" slot="prefix" name="boat"></mid-icon>
          `}
      ${suffix ? html`<span slot="suffix">${suffix}</span>` : nothing}
    </mid-textfield>`,
};
