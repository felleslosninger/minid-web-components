import type { Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../components/checkbox.component';
import { classMap } from 'lit/directives/class-map.js';

type CheckboxProps = Partial<{
  checked: boolean;
  disabled: boolean;
  readonly: boolean;
  size: 'sm' | 'md' | 'lg';
  label: string;
  description: string;
  invalid: boolean;
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
    invalid,
  }: CheckboxProps) => html`
    <mid-checkbox
      class="${classMap({
        'text-body-sm': size === 'sm',
        'text-body-md': size === 'md',
        'text-body-lg': size === 'lg',
      })}"
      ?checked=${checked}
      ?readonly=${readonly}
      ?disabled=${disabled}
      ?invalid=${invalid}
    >
      ${label}
      ${!description
        ? nothing
        : html` <span slot="description"> ${description} </span>`}
    </mid-checkbox>
  `,
};
