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
    open: true,
    stayopenonselect: true,
  },
  decorators: [(story) => html`<div class="mb-64">${story()}</div>`],
  render: ({ open, stayopenonselect }: ComboboxProps) => html`
    <label for="my-input"> Choose flavor of ice cream </label>
    <mid-dropdown
      class="flex"
      ?open=${open}
      ?stayopenonselect=${stayopenonselect}
      sync="width"
    >
      <input
        type="search"
        class="border"
        slot="trigger"
        id="my-input"
        list="my-list"
      />

      <u-datalist
        class="max-h-40 overflow-y-auto border"
        id="my-list"
        data-sr-singular="%d land"
        data-sr-plural="%d land"
      >
        ${getCountries()
          .sort((a, b) => a.localeCompare(b))
          .map((country) => {
            return html`<u-option
              class="w-full truncate p-2"
              value="${country}"
            >
              <mid-icon
                class="h-4 w-6 rounded"
                library="country"
                name="${country}"
              ></mid-icon>
              <span>${countryLabelsNO[country]}</span></u-option
            >`;
          })}
      </u-datalist>
    </mid-dropdown>

    <style>
      /* Styling just for example: */
      u-option[selected] {
        font-weight: bold;
      }
    </style>
  `,
};
