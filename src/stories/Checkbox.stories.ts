import type { Meta, StoryObj } from '@storybook/web-components-vite';
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
  '--': string;
  description: string;
  descriptionAttr: string;
  invalid: boolean;
  value: string;
}>;

const meta = {
  title: 'Komponenter/Checkbox',
  component: 'mid-checkbox',
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description:
        'Size can be controlled by setting the font-size on the checkbox',
    },
    value: { type: 'string' },
    '--': { name: '-' },
    descriptionAttr: {
      name: 'description',
      type: 'string',
      table: { category: 'attributes', defaultValue: { summary: '' } },
    },
  },
} satisfies Meta<CheckboxProps>;

export default meta;
type Story = StoryObj<CheckboxProps>;

export const Main: Story = {
  args: {
    '--': 'Godkjenn deling av dine personlige data',
    descriptionAttr: 'Obs! Obs! Dette kan ikke reverseres',
  },
  render: ({
    checked,
    description,
    descriptionAttr,
    disabled,
    '--': label,
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
      description=${ifDefined(descriptionAttr)}
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
