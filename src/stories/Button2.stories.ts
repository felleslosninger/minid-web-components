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
      options: ['md', 'ld', 'sm'],
      control: { type: 'radio' },
    },
    type: {
      options: ['submit', 'button', 'reset'],
      control: { type: 'select' },
    },
    href: {control: 'text'},
    isLink: {table: {disable: true}},
  },

  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
  },

};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: (args) => html`
    <mid-button variant="${args.variant}">
      <slot>Click me!</slot> 
    </mid-button>
  `,

};

export const Secondary: Story = {
  render: (args) => html`
    <mid-button variant="${args.variant}">
      <slot>Click me!</slot> 
    </mid-button>
  `,
  args: {
    variant: "secondary",
  }
};

export const Link: Story = {
  render: (args) => html`
    <mid-button href="${args.href}">
      <slot>Click me!</slot> 
    </mid-button>
  `,
  args: {
    href: "https://digdir.no/",
  }
};