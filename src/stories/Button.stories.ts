import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../components/button.component';
import { MinidButton } from '../components/button.component';

type ButtonProps = {
  variant?: MinidButton['variant'];
  'data-size'?: 'sm' | 'md' | 'lg';
  type?: MinidButton['type'];
  'data-color'?: string;
  label: string;
  href?: string;
  fullwidth?: boolean;
  disabled?: boolean;
  iconstyled?: boolean;
  loading?: boolean;
  loadingtext?: string;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Button',
  component: 'mid-button',
  argTypes: {
    'data-size': {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'tertiary'],
    },
    type: {
      control: { type: 'radio' },
      options: ['button', 'submit', 'reset'],
    },
    'data-color': {
      type: 'string',
      control: { type: 'select' },
      options: ['accent', 'neutral', 'danger'],
    },
    href: {
      control: { type: 'text' },
    },
  },
  parameters: {
    controls: {
      exclude: ['button', 'internals'],
    },
  },
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<ButtonProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {
    label: 'Knapp',
  },
  render: ({
    variant,
    'data-size': size,
    'data-color': color,
    label,
    type,
    href,
    disabled,
    fullwidth,
    iconstyled,
    loading,
    loadingtext,
  }: ButtonProps) => {
    return html`<mid-button
      @click=${onclick}
      type="${ifDefined(type)}"
      data-size=${ifDefined(size)}
      data-color=${ifDefined(color)}
      variant=${ifDefined(variant)}
      href=${ifDefined(href)}
      loadingtext=${ifDefined(loadingtext)}
      ?fullwidth=${fullwidth}
      ?disabled=${disabled}
      ?iconstyled=${iconstyled}
      ?loading=${loading}
    >
      ${label}
    </mid-button>`;
  },
};
