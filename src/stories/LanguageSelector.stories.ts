import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/language-selector.component';
import { MinidLanguageSelector } from '../components/language-selector.component';

type LanguageSelectorProps = Partial<{
  locale: MinidLanguageSelector['locale'];
  languages: MinidLanguageSelector['languages'];
  change: (event: CustomEvent<{ locale: string }>) => void;
}>;

const meta = {
  title: 'Komponenter/LanguageSelector',
  tags: ['autodocs'],
  component: 'mid-language-selector',
  argTypes: {
    locale: {
      control: { type: 'radio' },
      options: ['nb', 'nn', 'en', 'se'],
    },
    languages: {
      control: { disable: true },
    },
  },
  args: {
    locale: 'nb',
    change: ({ detail: { locale } }) => {
      console.log('Language changed to:', locale);
    },
  },
  parameters: {
    controls: {
      exclude: ['change'],
    },
  },
} satisfies Meta<LanguageSelectorProps>;

export default meta;
type Story = StoryObj<LanguageSelectorProps>;

export const Default: Story = {
  decorators: [(story) => html`<div class="m-56">${story()}</div>`],
  parameters: {
    layout: 'centered',
  },
  render: ({ locale, change }: LanguageSelectorProps) => html`
    <mid-language-selector
      locale=${locale ?? 'nb'}
      @mid-language-change=${change}
    ></mid-language-selector>
  `,
};

export const Mobile: Story = {
  decorators: [
    (story) =>
      html`<div class="m-56" style="width: 60px">${story()}</div>`,
  ],
  parameters: {
    layout: 'centered',
  },
  render: ({ locale, change }: LanguageSelectorProps) => html`
    <mid-language-selector
      locale=${locale ?? 'nb'}
      @mid-language-change=${change}
    ></mid-language-selector>
  `,
};
