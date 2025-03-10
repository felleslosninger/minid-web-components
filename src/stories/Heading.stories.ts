import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/heading.component';
import { MinidHeading } from '../components/heading.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type HeadingProps = {
  size?: MinidHeading['size'];
  spacing?: MinidHeading['spacing'];
  level?: MinidHeading['level'];
};

const meta: Meta = {
  title: 'Typografi/Heading',
  component: 'mid-heading',
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    level: {
      control: { type: 'number', min: 1, max: 6 },
    },
    spacing: {
      control: { type: 'number', min: 0, max: 6 },
    },
  },
};

export default meta;

type Story = StoryObj<HeadingProps>;

export const Main: Story = {
  render: ({ size, spacing, level }: HeadingProps) => html`
    <mid-heading
      level=${ifDefined(level)}
      size="${ifDefined(size)}"
      spacing=${ifDefined(spacing)}
      >En Viktig Overskrift
    </mid-heading>
  `,
};
