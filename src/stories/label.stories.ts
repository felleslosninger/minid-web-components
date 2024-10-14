import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/label.component';
import type { MinidLabel } from '../components/label.component';

const meta: Meta = {
  title: 'Typografi/label',
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

type labelProps = {
  size: MinidLabel['size'];
  weight: MinidLabel['weight'];
  spacing: boolean;
};

type Story = StoryObj<labelProps>;

export const Primary: Story = {
  render: (args) => label(args),
  args: {
    size: 'md',
    spacing: false,
  },
};

const label = ({ size, spacing, weight }: labelProps) => {
  return html`
    <mid-label size="${size}" ?spacing=${spacing} weight=${weight}
      >Vennligst skriv inn kontonummer og pin-kode
    </mid-label>
  `;
};
