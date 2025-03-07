import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/label.component';
import type { MinidLabel } from '../components/label.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type labelProps = {
  size?: MinidLabel['size'];
  weight?: MinidLabel['weight'];
  spacing?: boolean;
  mb?: MinidLabel['mb'];
};

const meta: Meta = {
  title: 'Typografi/Label',
  component: 'mid-label',
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['xs', 'sm', 'md', 'lg'],
    },
    weight: {
      control: { type: 'radio' },
      options: ['regular', 'medium', 'semibold'],
    },
    for: {
      type: 'string',
    },
    mb: {
      control: { type: 'number', min: 0, max: 6 },
    },
  },
};

export default meta;

type Story = StoryObj<labelProps>;

export const Main: Story = {
  render: (args) => label(args),
  args: {
    spacing: false,
  },
};

const label = ({ size, spacing, weight, mb }: labelProps) => {
  return html`
    <mid-label
      size="${ifDefined(size)}"
      ?spacing=${spacing}
      weight=${ifDefined(weight)}
      mb=${ifDefined(mb)}
    >
      Vennligst skriv inn kortnummer og pin-kode
    </mid-label>
  `;
};
