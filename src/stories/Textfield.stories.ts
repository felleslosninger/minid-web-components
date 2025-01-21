import type { Meta, StoryObj } from '@storybook/web-components';
import '../components/textfield.component';
import '../components/icon/icon.component';
import { html, nothing, Part } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

type TextfieldProps = {
  label?: string;
  labelAttr?: string;
  value?: string;
  placeholder?: string;
  type?: 'text';
  size?: 'sm' | 'md' | 'lg';
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
  invalidmessage?: string;
  input: Part;
  base: Part;
  'form-control': Part;
  'clear-button': Part;
  'password-toggle-button': Part;
  'mid-change'?: Event;
  'mid-input'?: Event;
  'mid-clear': Event;
  'mid-focus': Event;
  'mid-blur': Event;
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
    'form-control': { control: { disable: true } },
    'clear-button': { control: { disable: true } },
    'password-toggle-button': { control: { disable: true } },
    input: { control: { disable: true } },
    base: { control: { disable: true } },
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
    required: true,
  },
  decorators: [
    (story) =>
      html`<div class="w-80">${story()}</div>
        <script lang="ts">
          var lol = document.querySelector('.w-80');
          // lol.addEventListener('mid-invalid-hide', console.log);
          // lol.addEventListener('mid-invalid-show', console.log);
          lol.addEventListener('mid-valid-change', console.log);
          lol.addEventListener('invalid', (event) => {
            event.preventDefault();
            event.stopPropagation();
            console.log('invalid: ', event);
          });
          MinidTextfield.formControlValidators = [requiredValidator];
        </script> `,
  ],
  render: ({
    labelAttr,
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
    invalidmessage,
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
      invalidmessage=${ifDefined(invalidmessage)}
      autocomplete=${ifDefined(autocomplete)}
      description=${ifDefined(description)}
      label="${ifDefined(labelAttr)}"
      value=${ifDefined(value)}
      placeholder=${ifDefined(placeholder)}
      pattern=${ifDefined(pattern)}
      type=${ifDefined(type)}
      size=${ifDefined(size)}
      min=${ifDefined(min)}
      max=${ifDefined(max)}
      minlength=${ifDefined(minlength)}
      maxlength=${ifDefined(maxlength)}
    >
      ${prefix ? html`<span slot="prefix">${prefix}</span>` : nothing}
      ${suffix ? html`<span slot="suffix">${suffix}</span>` : nothing}
      ${label ? html`<span slot="label">${label}</span>` : nothing}
    </mid-textfield>`,
};
