import type { Meta, StoryObj } from '@storybook/web-components';
import '../components/textfield.component';
import '../components/icon/icon.component';
import { html, nothing, Part } from 'lit';
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
  readonly?: boolean;
  description?: string;
  clearable?: boolean;
  hidelabel?: boolean;
  id?: string;
  input: Part;
  base: Part;
  'form-control': Part;
  'mid-change'?: Event;
  'mid-input'?: Event;
  'mid-clear': Event;
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
      options: [
        'date',
        'datetime-local',
        'email',
        'file',
        'month',
        'number',
        'password',
        'search',
        'tel',
        'text',
        'time',
        'url',
        'week',
      ],
    },
    'mid-change': { control: { disable: true } },
    'mid-input': { control: { disable: true } },
    'mid-clear': { control: { disable: true } },
    'form-control': { control: { disable: true } },
    input: { control: { disable: true } },
    base: { control: { disable: true } },
  },
  parameters: {
    controls: {
      exclude: [],
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
  decorators: [(story) => html`<div class="w-80">${story()}</div>`],
  render: ({
    label,
    placeholder,
    size,
    type,
    value,
    prefix,
    suffix,
    disabled,
    clearable,
    hidelabel,
    readonly,
    description,
  }: TextfieldProps) =>
    html`<mid-textfield
      ?disabled=${disabled}
      ?clearable=${clearable}
      ?readonly=${readonly}
      ?hideLabel=${hidelabel}
      description=${ifDefined(description)}
      label="${ifDefined(label)}"
      value=${ifDefined(value)}
      placeholder=${ifDefined(placeholder)}
      type=${ifDefined(type)}
      size=${ifDefined(size)}
    >
      ${prefix ? html`<span slot="prefix">${prefix}</span>` : nothing}
      ${suffix ? html`<span slot="suffix">${suffix}</span>` : nothing}
    </mid-textfield>`,
};
