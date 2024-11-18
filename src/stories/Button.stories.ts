import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../components/button.component';
import { MinidButton } from '../components/button.component';

type ButtonProps = {
  variant?: MinidButton['variant'];
  size?: MinidButton['size'];
  type?: MinidButton['type'];
  label: string;
  href?: string;
  fullwidth?: boolean;
  disabled?: boolean;
  iconstyled?: boolean;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Button',
  component: 'mid-button',
  argTypes: {
    size: {
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
    href: {
      control: { type: 'text' },
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
    size,
    label,
    type,
    href,
    disabled,
    fullwidth,
    iconstyled,
  }: ButtonProps) => {
    return html`<mid-button
      @click=${onclick}
      type="${ifDefined(type)}"
      size=${ifDefined(size)}
      variant=${ifDefined(variant)}
      href=${ifDefined(href)}
      ?fullwidth=${fullwidth}
      ?disabled=${disabled}
      ?iconstyled=${iconstyled}
      >${label}
    </mid-button>`;
  },
};
