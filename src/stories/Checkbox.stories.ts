import type { Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit';
import '../components/checkbox.component';
import type { MinidCheckbox } from '../components/checkbox.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type CheckboxProps = {
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  size?: MinidCheckbox['size'];
  label?: string;
  description?: string;
  hidelabel?: boolean;
  validationmessage?: string;
  'data-color'?: string;
};

const meta = {
  title: 'Komponenter/Checkbox',
  component: 'mid-checkbox',
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
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
  },
} satisfies Meta<CheckboxProps>;

export default meta;
type Story = StoryObj<CheckboxProps>;

export const Main: Story = {
  args: {
    label: 'Godkjenn deling av dine personlige bankdata?',
    description: 'Obs! Obs! Dette kan ikke reverseres',
    checked: true,
  },
  render: ({
    value,
    checked,
    description,
    disabled,
    label,
    readonly,
    size,
    hidelabel,
    validationmessage,
    'data-color': color,
  }: CheckboxProps) => html`
    <mid-checkbox
      value=${ifDefined(value)}
      ?checked=${checked}
      ?readonly=${readonly}
      ?disabled=${disabled}
      size=${ifDefined(size)}
      ?hidelabel=${hidelabel}
      validationmessage=${ifDefined(validationmessage)}
      data-color=${ifDefined(color)}
    >
      ${label}
      ${!description
        ? nothing
        : html` <span slot="description"> ${description} </span>`}
    </mid-checkbox>
  `,
};
