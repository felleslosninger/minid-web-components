import type { Meta, StoryObj } from '@storybook/web-components';
import '../components/textfield.component';
import '../components/button.component';
import { html, nothing, Part } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MinidTextfield } from '../components/textfield.component';

type TextfieldProps = {
  label?: string;
  labelAttr?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  type?: MinidTextfield['type'];
  'data-size'?: 'sm' | 'md' | 'lg';
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  description?: string;
  clearable?: boolean;
  hidelabel?: boolean;
  passwordtoggle?: boolean;
  passwordvisible?: boolean;
  pattern?: string;
  autocomplete?: string;
  autofocus?: boolean;
  minlength?: number;
  maxlength?: number;
  min?: number;
  max?: number;
  validationmessage?: string;
  input: Part;
  base: Part;
  field: Part;
  'clear-button': Part;
  'password-toggle-button': Part;
  'mid-change'?: Event;
  'mid-input'?: Event;
  'mid-clear': Event;
  'mid-focus': Event;
  'mid-blur': Event;
  'mid-invalid-show': Event;
  'mid-invalid-hide': Event;
  inputId: never;
  descriptionId: never;
  validationId: never;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Textfield',
  tags: ['autodocs'],
  component: 'mid-textfield',
  argTypes: {
    'data-size': {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    min: { type: 'number' },
    max: { type: 'number' },
    minlength: { type: 'number' },
    maxlength: { type: 'number' },
    autocomplete: { type: 'string' },
    placeholder: { type: 'string' },
    labelAttr: {
      name: 'label',
      type: 'string',
      table: { category: 'attributes', defaultValue: { summary: '' } },
    },
    name: {
      type: 'string',
      table: { category: 'attributes' },
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
    'mid-focus': { control: { disable: true } },
    'mid-blur': { control: { disable: true } },
    'mid-invalid-show': { control: { disable: true } },
    'mid-invalid-hide': { control: { disable: true } },
    field: { control: { disable: true } },
    'clear-button': { control: { disable: true } },
    'password-toggle-button': { control: { disable: true } },
    input: { control: { disable: true } },
    base: { control: { disable: true } },
    descriptionId: { table: { disable: true } },
    inputId: { table: { disable: true } },
    validationId: { table: { disable: true } },
  },
  parameters: {
    controls: {
      exclude: ['hasFocus', 'internals'],
    },
  },
} satisfies Meta<TextfieldProps>;

export default meta;
type Story = StoryObj<TextfieldProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    labelAttr: 'Tekst input',
    passwordtoggle: true,
    type: 'password',
  },
  render: ({
    labelAttr,
    label,
    placeholder,
    'data-size': dataSize,
    type,
    value,
    name,
    prefix,
    suffix,
    disabled,
    clearable,
    hidelabel,
    readonly,
    required,
    description,
    passwordtoggle,
    passwordvisible,
    pattern,
    autocomplete,
    autofocus,
    min,
    max,
    minlength,
    maxlength,
    validationmessage,
  }: TextfieldProps) =>
    html`<mid-textfield
      ?disabled=${disabled}
      ?autofocus=${autofocus}
      ?clearable=${clearable}
      ?readonly=${readonly}
      ?required=${required}
      ?hideLabel=${hidelabel}
      ?passwordtoggle=${passwordtoggle}
      ?passwordvisible=${passwordvisible}
      validationmessage=${ifDefined(validationmessage)}
      autocomplete=${ifDefined(autocomplete)}
      description=${ifDefined(description)}
      label="${ifDefined(labelAttr)}"
      value=${ifDefined(value)}
      name=${ifDefined(name)}
      placeholder=${ifDefined(placeholder)}
      pattern=${ifDefined(pattern)}
      type=${ifDefined(type)}
      min=${ifDefined(min)}
      max=${ifDefined(max)}
      minlength=${ifDefined(minlength)}
      maxlength=${ifDefined(maxlength)}
      data-size=${ifDefined(dataSize)}
    >
      ${prefix ? html`<span slot="prefix">${prefix}</span>` : nothing}
      ${suffix ? html`<span slot="suffix">${suffix}</span>` : nothing}
      ${label ? html`<span slot="label">${label}</span>` : nothing}
    </mid-textfield> `,
};
