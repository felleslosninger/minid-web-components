import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/link.component';
import '../components/icon/icon.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type LinkProps = {
  label?: string;
  href?: string;
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

  render: ({ href, label, target }: LinkProps) => html`
    <mid-link
      class="text-body-md"
      href=${ifDefined(href)}
      target=${ifDefined(target)}
    >
      ${label}
      <mid-icon class="text-6" name="external-link"></mid-icon>
    </mid-link>
  `,
};
