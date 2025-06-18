import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../components/label.component';
import type { MinidLabel } from '../components/label.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type labelProps = Partial<{
  size: MinidLabel['size'];
  weight: MinidLabel['weight'];
  spacing: boolean;
}>;

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
      options: ['medium', 'normal', 'semibold'],
    },
  },
};

export default meta;

type Story = StoryObj<labelProps>;

export const Main: Story = {
  render: (args) => label(args),
  args: {
    size: 'md',
    spacing: false,
  },
};

const label = ({ size, spacing, weight }: labelProps) => {
  return html`
    <mid-label
      size="${ifDefined(size)}"
      ?spacing=${spacing}
      weight=${ifDefined(weight)}
      >Vennligst skriv inn kortnummer og pin-kode
    </mid-label>
  `;
};
