import type { Meta, StoryObj } from '@storybook/web-components';
import '../components/textfield.component';
import '../components/button.component';
import { html, nothing, Part } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

type TextfieldProps = {
  label?: string;
  labelAttr?: string;
  name?: string;
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
  'mid-invalid-show': Event;
  'mid-invalid-hide': Event;
  '#inputId': never;
  '#descriptionId': never;
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
    'form-control': { control: { disable: true } },
    'clear-button': { control: { disable: true } },
    'password-toggle-button': { control: { disable: true } },
    input: { control: { disable: true } },
    base: { control: { disable: true } },
    '#descriptionId': { table: { disable: true } },
    '#inputId': { table: { disable: true } },
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
    pattern: '^[a-zA-Z0-9]{5,30}$',
    name: 'textfield-data',
    value: 'initialValue',
  },
  decorators: [
    (story) =>
      html`<form
          class="flex w-80 flex-col gap-4"
          @reset=${() => {
            document.querySelector('.output')!.textContent = '';
          }}
          @submit=${(event: SubmitEvent) => {
            event.preventDefault();

            const target = event.target as HTMLFormElement;
            const valid = target.reportValidity();
            const formData = new FormData(target);
            const data = Object.fromEntries(formData);

            console.log(valid, data);
            document.querySelector('.output')!.textContent = JSON.stringify({
              ...data,
            });
          }}
        >
          ${story()}
          <div class="flex flex-row-reverse items-end justify-end gap-4">
            <pre class="output"></pre>
            <mid-button type="submit"> Submit </mid-button>
            <mid-button variant="secondary" type="reset"> Reset </mid-button>
          </div>
        </form>
        <script lang="ts">
          const textfield = document.querySelector('mid-textfield');

          textfield.addEventListener('mid-invalid-show', (event) => {
            console.log(event);
            if (event.detail.validity.patternMismatch) {
              textfield.invalidmessage = 'Invalid pattern';
            } else if (event.detail.validity.valueMissing) {
              textfield.invalidmessage = 'Value is required';
            } else {
              textfield.invalidmessage = 'Invalid input';
            }
          });
          textfield.addEventListener('mid-invalid-hide', (event) => {
            console.log(event);
            textfield.invalidmessage = '';
          });
        </script> `,
  ],
  render: ({
    labelAttr,
    label,
    placeholder,
    size,
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
      name=${ifDefined(name)}
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
