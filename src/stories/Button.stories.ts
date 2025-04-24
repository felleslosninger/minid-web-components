import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../components/button.component';
import { MinidButton } from '../components/button.component';

type ButtonProps = Partial<{
  variant: MinidButton['variant'];
  size: MinidButton['size'];
  type: MinidButton['type'];
  label: string;
  href: string;
  disabled: boolean;
  iconstyled: boolean;
  loading: boolean;
  loadingtext: string;
}>;

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
    size,
    label,
    type,
    href,
    disabled,
    iconstyled,
    loading,
    loadingtext,
  }: ButtonProps) => {
    return html`
      <mid-button
        @click=${console.log}
        type="${ifDefined(type)}"
        size=${ifDefined(size)}
        variant=${ifDefined(variant)}
        href=${ifDefined(href)}
        loadingtext=${ifDefined(loadingtext)}
        ?disabled=${disabled}
        ?iconstyled=${iconstyled}
        ?loading=${loading}
        >${label}
      </mid-button>
    `;
  },
};
