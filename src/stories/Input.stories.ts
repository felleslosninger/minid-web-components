import type { Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit';
import '../components/input.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MinidInput } from '../components/input.component';

type InputProps = {
  checked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  size?: MinidInput['size'];
  label?: string;
  description?: string;
  type?: MinidInput['type'];
  validationmessage?: string;
  placeholder?: string;
  autocomplete?: string;
  hidelabel?: boolean;
};

const meta = {
  title: 'Komponenter/Input',
  component: 'mid-input',
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: { type: 'select' },
      options: [
        'checkbox',
        'color',
        'date',
        'datetime-local',
        'email',
        'file',
        'hidden',
        'month',
        'number',
        'password',
        'radio',
        'search',
        'tel',
        'text',
        'time',
        'url',
        'week',
      ],
    },
    placeholder: { type: 'string' },
    autocomplete: { type: 'string' },
  },
} satisfies Meta<InputProps>;

export default meta;
type Story = StoryObj<InputProps>;

export const Main: Story = {
  args: {
    label: 'Godkjenn deling av dine personlige bankdata?',
    description: 'Obs! Obs! Dette kan ikke reverseres',
  },
  render: ({
    type,
    checked,
    description,
    disabled,
    label,
    readonly,
    size,
    validationmessage,
    placeholder,
    hidelabel,
  }: InputProps) => html`
    <mid-input
      ?checked=${checked}
      ?readonly=${readonly}
      ?disabled=${disabled}
      size=${ifDefined(size)}
      type=${ifDefined(type)}
      validationmessage=${ifDefined(validationmessage)}
      placeholder=${ifDefined(placeholder)}
      ?hidelabel=${hidelabel}
      description=${ifDefined(description)}
    >
      ${!label ? nothing : html`<span slot="label">${label}</span>`}
      ${!description
        ? nothing
        : html` <span slot="description"> ${description} </span>`}
    </mid-input>
  `,
};
