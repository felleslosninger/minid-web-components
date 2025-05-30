import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/combobox.component';
import '../components/dropdown.component';
import '../components/menu.component';
import '../components/menu-item.component';
import '../components/textfield.component';
import '@u-elements/u-datalist';
import countryLabelsNO, {
  getCountries,
  type CountryCode,
} from '../utilities/country-labels-no';

type ComboboxProps = Partial<{
  open: boolean;
  stayopenonselect: boolean;
}>;

const meta: Meta = {
  title: 'Komponenter/Under arbeid/U-Datalist',
  component: 'mid-combobox',
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;

type Story = StoryObj<ComboboxProps>;

export const Main: Story = {
  args: {
    open: false,
    stayopenonselect: true,
  },
  decorators: [(story) => html`<div class="mb-64">${story()}</div>`],
  render: ({ open, stayopenonselect }: ComboboxProps) => html`
    <label class="mb-2 block" for="my-input"> Choose a country </label>
    <mid-dropdown
      class="flex"
      ?open=${open}
      ?stayopenonselect=${stayopenonselect}
      sync="width"
    >
      <input
        type="tel"
        class="mid-input"
        slot="trigger"
        @focus=${(event) => {
          document.getElementById('my-input')?.focus();
        }}
      />
      <div class="border">
        <input type="search" class="w-full" id="my-input" list="my-list" />
        <u-datalist
          class="max-h-40 overflow-y-auto"
          id="my-list"
          data-sr-singular="%d land"
          data-sr-plural="%d land"
        >
          ${getCountries()
            .sort((a, b) => a.localeCompare(b))
            .map((country) => {
              return html`<u-option
                class="truncate p-2"
                @change=${(event) => {
                  console.log(event);
                }}
                value="${country}"
              >
                <mid-icon
                  class="h-4 w-6 overflow-hidden rounded"
                  library="country"
                  name="${country}"
                ></mid-icon>
                <span>${countryLabelsNO[country]}</span>
              </u-option>`;
            })}
        </u-datalist>
      </div>
    </mid-dropdown>

    <style>
      /* Styling just for example: */
      u-option[selected] {
        font-weight: bold;
      }
    </style>
  `,
};
