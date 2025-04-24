import type { Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit';
import '../components/checkbox.component';
import type { MinidCheckbox } from '../components/checkbox.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type CheckboxProps = Partial<{
  checked: boolean;
  disabled: boolean;
  readonly: boolean;
  size: MinidCheckbox['size'];
  label: string;
  description: string;
}>;

const meta = {
  title: 'Komponenter/Checkbox',
  component: 'mid-checkbox',
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<CheckboxProps>;

export default meta;
type Story = StoryObj<CheckboxProps>;

export const Main: Story = {
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
  }: CheckboxProps) => html`
    <mid-checkbox
      ?checked=${checked}
      ?readonly=${readonly}
      ?disabled=${disabled}
      size=${ifDefined(size)}
    >
      ${label}
      ${!description
        ? nothing
        : html` <span slot="description"> ${description} </span>`}
    </mid-checkbox>
  `,
};
