import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing, Part } from 'lit';
import '../components/code-input.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type CodeInputProps = Partial<{
  length: number;
  minlength: number;
  value: string;
  label: string;
  labelAttr: string;
  type: 'number' | 'text';
  size: 'sm' | 'md' | 'lg';
  inputmode: 'numeric' | 'text';
  invalidmessage: string;
  pattern: string;
  autofocus: boolean;
  disabled: boolean;
  readonly: boolean;
  hidelabel: boolean;
  event: Event;
  'mid-change': Event;
  'mid-input': Event;
  'mid-complete': Event;
  'mid-invalid-show': Event;
  'mid-invalid-hide': Event;
  'input-container': Part;
}>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Code Input',
  component: 'mid-code-input',
  tags: ['beta'],
  argTypes: {
    value: { type: 'string' },
    pattern: { type: 'string' },
    minlength: { type: 'number' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    type: { control: 'radio', options: ['number', 'text'] },
    inputmode: { control: 'radio', options: ['numeric', 'text'] },
    labelAttr: {
      name: 'label',
      type: 'string',
      table: { category: 'attributes', defaultValue: { summary: '' } },
    },
    'mid-change': { control: { disable: true } },
    'mid-input': { control: { disable: true } },
    'mid-complete': { control: { disable: true } },
    'mid-invalid-show': { control: { disable: true } },
    'mid-invalid-hide': { control: { disable: true } },
    'input-container': { control: { disable: true } },
    event: { table: { disable: true } },
  },
} satisfies Meta<CodeInputProps>;

export default meta;
type Story = StoryObj<CodeInputProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {
    labelAttr: 'Engangskode',
  },
  render: ({
    length,
    minlength,
    value,
    label,
    labelAttr,
    type,
    size,
    autofocus,
    disabled,
    hidelabel,
    readonly,
    inputmode,
    invalidmessage,
  }: CodeInputProps) => {
    return html`
      <mid-code-input
        value=${ifDefined(value)}
        label=${ifDefined(labelAttr)}
        length=${ifDefined(length)}
        minlength=${ifDefined(minlength)}
        type=${ifDefined(type)}
        size=${ifDefined(size)}
        inputmode=${ifDefined(inputmode)}
        invalidmessage=${ifDefined(invalidmessage)}
        ?hidelabel=${hidelabel}
        ?readonly=${readonly}
        ?autofocus=${autofocus}
        ?disabled=${disabled}
      >
        ${label ? html`<span slot="label">${label}</span>` : nothing}
      </mid-code-input>
    `;
  },
};
