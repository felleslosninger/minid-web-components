import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../components/button.component';
import { MinidButton } from '../components/button.component';
import { expect, fn, waitFor } from 'storybook/test';

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
  button: HTMLElement;
  handleClick: () => void;
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
    button: { control: { disable: true } },
  },
  args: {
    label: 'Knapp',
    handleClick: fn(() => {
      console.log('Button clicked');
    }),
  },
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<ButtonProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

const render = ({
  handleClick: onClick,
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
      @click=${onClick}
      type="${ifDefined(type)}"
      size=${ifDefined(size)}
      variant=${ifDefined(variant)}
      href=${ifDefined(href)}
      loadingtext=${ifDefined(loadingtext)}
      ?disabled=${disabled}
      ?iconstyled=${iconstyled}
      ?loading=${loading}
    >
      ${label}
    </mid-button>
  `;
};

export const Main: Story = {
  render,
  play: async ({ canvas, args, userEvent }) => {
    const button = await canvas.findByShadowRole('button');

    await userEvent.click(button);
    await expect(args.handleClick).toHaveBeenCalledOnce();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render,
  play: async ({ canvas, args, userEvent }) => {
    const button = canvas.getByShadowRole('button');

    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.handleClick).not.toHaveBeenCalled();
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    loadingtext: 'Laster...',
  },
  render,
  play: async ({ canvas, args, userEvent }) => {
    const button = await canvas.findByShadowRole('button', {
      name: args.loadingtext!,
    });
    const spinner = button.querySelector('mid-spinner');
    await expect(spinner).toBeInTheDocument();
    await expect(button).toHaveTextContent(args.loadingtext!);
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.handleClick).not.toHaveBeenCalled();
  },
};

export const ButtonLink: Story = {
  args: {
    href: 'https://example.com',
    label: 'Link knapp',
  },
  render,
  play: async ({ canvas, args, userEvent }) => {
    const link = await canvas.findByShadowRole('link', { name: args.label });
    await expect(link).toHaveAttribute('href', args.href!);
  },
};
