import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/heading.component';
import { MinidHeading } from '../components/heading.component';

const meta: Meta = {
  title: 'Typografi/Heading',
  component: 'mid-heading',
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    level: {
      control: { type: 'number', min: 1, max: 6 },
    },
  },
};

export default meta;

type HeadingProps = {
  size: MinidHeading['size'];
  spacing: boolean;
  level: MinidHeading['level'];
};

type Story = StoryObj<HeadingProps>;

export const Primary: Story = {
  render: (args) => Heading(args),
  args: {
    level: 1,
    size: 'md',
    spacing: true,
  },
};

const Heading = ({ size, spacing, level }: HeadingProps) => {
  return html`
    <mid-heading level=${level} size="${size}" ?spacing=${spacing}
      >En Viktig Overskrift
    </mid-heading>
  `;
};
