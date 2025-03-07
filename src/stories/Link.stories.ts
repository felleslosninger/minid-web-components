import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/link.component';
import '../components/icon/icon.component';
import '../components/paragraph.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MinidLink } from '../components/link.component';

type LinkProps = {
  label?: string;
  href?: string;
  target?: string;
  size?: MinidLink['size'];
  mb?: MinidLink['mb'];
};

const meta: Meta = {
  title: 'Typografi/Link',
  component: 'mid-link',
  argTypes: {
    href: { type: 'string' },
    target: { type: 'string' },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    mb: {
      control: { type: 'number', min: 0, max: 6 },
    },
  },
};

export default meta;

type Story = StoryObj<LinkProps>;

export const Main: Story = {
  args: {
    label: 'Gå til designsystemet',
    href: 'https://designsystemet.no/',
  },
  decorators: [(story) => html`<div class="grid gap-4">${story()}</div> `],
  render: ({ href, label, target, size, mb }: LinkProps) => html`
    <mid-link
      href=${ifDefined(href)}
      target=${ifDefined(target)}
      size=${ifDefined(size)}
      mb=${ifDefined(mb)}
    >
      ${label}
    </mid-link>

    <mid-paragraph size=${ifDefined(size)} mb=${ifDefined(mb)}>
      Her brukes litt styles og sånn rett fra
      <mid-link href=${ifDefined(href)} target=${ifDefined(target)}>
        <mid-icon name="external-link"></mid-icon>
        Designsystemet
      </mid-link>
    </mid-paragraph>
  `,
};
