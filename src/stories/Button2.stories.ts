import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/button.component';

const meta: Meta = {
  title: 'Komponenter/Button2',
  component: 'mid-button',

  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'tertiary'],
      control: { type: 'radio' },
    },
    size: {
      options: ['md', 'lg', 'sm'],
      control: { type: 'radio' },
    },
    type: {
      options: ['submit', 'button', 'reset'],
      control: { type: 'select' },
    },
    href: { control: 'text' },
    isLink: { table: { disable: true } },
  },

  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    label: 'Knapp',
    args: '',
  },

};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: (args) => html`
    <mid-button variant="${args.variant}" size=${args.size} href=${args.href} type=${args.type}>
      <slot>${args.label}</slot>
    </mid-button>
  `,

};

export const Secondary: Story = {
  render: (args) => html`
    <mid-button variant="${args.variant}">
      <slot>${args.label}</slot>
    </mid-button>
  `,
  args: {
    variant: 'secondary',
  },
};

export const Link: Story = {
  render: (args) => html`
    <mid-button href="${args.href}" variant=${args.variant}>
      <slot>${args.href}</slot>
    </mid-button>
  `,
  args: {
    href: 'https://digdir.no/',
    variant: 'tertiary',
  },
};