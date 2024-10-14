import type { Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit';
import '../components/checkbox.component';
import type { MinidCheckbox } from '../components/checkbox.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type CheckboxProps = {
  checked?: boolean;
  'checkbox-id'?: string;
  disabled?: boolean;
  readonly?: boolean;
  size?: MinidCheckbox['size'];
  label?: string;
  description?: string;
  'checkbox-position'?: MinidCheckbox['checkboxPosition'];
};

const meta: Meta = {
  title: 'Komponenter/Checkbox',
  component: 'mid-checkbox',
  argTypes: {
    'checkbox-position': {
      control: { type: 'radio' },
      options: ['right', 'left'],
    },
    size: { control: { type: 'radio' }, options: ['sm', 'md', 'lg'] },
    'checkbox-id': { control: { type: 'text' } },
  },
} satisfies Meta<CheckboxProps>;

export default meta;

type Story = StoryObj<CheckboxProps>;

export const Primary: Story = {
  args: {
    label: 'Godkjenn deling av dine personlige bankdata?',
    description: 'Obs! Obs! Dette kan ikke reverseres',
  },
  render: ({
    checked,
    description,
    disabled,
    label,
    readonly,
    size,
    ...rest
  }: CheckboxProps) => html`
    <mid-checkbox
      ?checked=${checked}
      ?readonly=${readonly}
      ?disabled=${disabled}
      size=${ifDefined(size)}
      description=${ifDefined(description)}
      checkbox-position=${ifDefined(rest['checkbox-position'])}
      checkbox-id=${ifDefined(rest['checkbox-id'])}
    >
      ${label}
      ${!description
        ? nothing
        : html` <span slot="description"> ${description} </span>`}
    </mid-checkbox>
  `,
};
