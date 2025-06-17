import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/combobox.component';
import '../components/dropdown.component';
import '../components/menu.component';
import '../components/menu-item.component';
import '../components/textfield.component';
import '@u-elements/u-datalist';
import countryLabelsNO, {
  type CountryCode,
  getCountries,
} from '../utilities/country-labels-no';

type ComboboxProps = Partial<{}>;

const meta: Meta = {
  title: 'Komponenter/Under arbeid/U-Datalist',
  argTypes: {},
};

export default meta;

type Story = StoryObj<ComboboxProps>;

export const Main: Story = {
  args: {},
  decorators: [(story) => html`<div class="mb-64">${story()}</div>`],
  render: (_: ComboboxProps) => html`
    <label class="mb-2 block" for="my-input"> Choose a country </label>
    <mid-dropdown sync="width" distance="2">
      <input class="mid-input" list="my-list" slot="trigger" />
      <u-datalist
        class="mid-menu max-h-40 overflow-y-auto p-1"
        id="my-list"
        data-sr-singular="%d land"
        data-sr-plural="%d land"
      >
        ${getCountries()
          .sort((a, b) =>
            Array<CountryCode>('NO', 'PL', 'DK', 'SE', 'US', 'GB').includes(a)
              ? -1
              : a.localeCompare(b)
          )
          .slice(0, 10)
          .map((country) => {
            return html`<u-option
              class="mid-menu-item truncate p-2"
              @change=${(event) => {
                console.log(event);
              }}
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
    </mid-dropdown>
  `,
};
