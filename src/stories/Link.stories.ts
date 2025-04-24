import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/link.component';
import '../components/icon/icon.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type LinkProps = Partial<{
  label: string;
  href: string;
  target: string;
}>;

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
  decorators: [(story) => html`<div class="grid gap-4">${story()}</div> `],
  render: ({ href, label, target }: LinkProps) => html`
    <mid-paragraph>
      Her brukes litt styles og sånn rett fra
      <mid-link href=${ifDefined(href)} target=${ifDefined(target)}>
        Designsystemet
        <mid-icon class="size-6" name="external-link"></mid-icon>
      </mid-link>
    </mid-paragraph>
  `,
};
