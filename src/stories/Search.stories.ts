import type { Meta, StoryObj } from '@storybook/web-components';
import '../components/search.component';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MinidSearch } from '../components/search.component';

type SearchProps = {
  label?: string;
  placeholder?: string;
  size?: MinidSearch['size'];
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Search',
  tags: ['autodocs'],
  component: 'mid-search',
  argTypes: {
    size: { control: { type: 'radio' }, options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    controls: {
      exclude: [],
    },
  },
} satisfies Meta<SearchProps>;

export default meta;
type Story = StoryObj<SearchProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    label: 'Søk',
    placeholder: 'Søk',
  },
  decorators: [(story) => html`<div class="flex max-w-6">${story()}</div>`],
  render: ({ label, placeholder, size }: SearchProps) =>
    html`<mid-search
      label=${ifDefined(label)}
      placeholder=${ifDefined(placeholder)}
      size=${ifDefined(size)}
      @input=${(event) => {
        console.log(event.target.value);
      }}
    ></mid-search>`,
};
