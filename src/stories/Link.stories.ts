import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/link.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type LinkProps = {
  label?: string;
  href?: string;
  inverted?: boolean;
  target?: string;
};

const meta: Meta = {
  title: 'Typografi/Link',
  component: 'mid-link',
  argTypes: {
    href: { type: 'string' },
    target: { type: 'string' },
  },
};

export default meta;

type Story = StoryObj<LinkProps>;

export const Main: Story = {
  args: {
    label: 'Gå til designsystemet',
    href: 'https://designsystemet.no/',
  },

  render: ({ href, label, inverted, target }: LinkProps) => html`
    <mid-link
      href=${ifDefined(href)}
      target=${ifDefined(target)}
      ?inverted=${inverted}
    >
      ${label}
    </mid-link>
  `,
};
