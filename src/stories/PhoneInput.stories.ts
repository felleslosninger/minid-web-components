import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/combobox.component';
import '../components/menu.component';
import '../components/menu-item.component';
import '../components/phone-input.component';
import '../components/search.component';
import '../components/icon/icon.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { CountryCode, getCountries } from 'libphonenumber-js';
import { countryLabelsNO } from '../components/utilities/countries';

type PhoneInputProps = {
  value?: string;
  country?: CountryCode;
  label?: string;
  hidelabel?: boolean;
};

const meta: Meta = {
  title: 'Komponenter/Under arbeid/Phone Input',
  component: 'mid-phone-input',
  argTypes: {
    country: { control: { type: 'select' }, options: getCountries() },
  },
  subcomponents: {
    Menu: 'mid-menu',
    MenuItem: 'mid-menu-item',
    Combobox: 'mid-combobox',
  },
};

export default meta;

type Story = StoryObj<PhoneInputProps>;

export const Main: Story = {
  args: {
    country: 'NO',
    label: 'Telefonnummer',
  },
  decorators: [
    (story) =>
      html`<div class="mb-64">
        ${story()}
        <pre class="pre"></pre>
      </div>`,
  ],
  render: ({ value, country, label, hidelabel }: PhoneInputProps) => html`
    <mid-combobox>
      <mid-phone-input
        slot="trigger"
        country=${ifDefined(country)}
        value=${ifDefined(value)}
        label=${ifDefined(label)}
        ?hidelabel=${hidelabel}
      >
      </mid-phone-input>
      <mid-menu searchable style="--max-height: 14rem">
        ${getCountries()
          .sort((a, b) =>
            Array<CountryCode>('NO', 'PL', 'DK', 'SE', 'US', 'GB').includes(a)
              ? -1
              : a.localeCompare(b)
          )
          .slice(0, 10)
          .map((country) => {
            return html`<mid-menu-item value=${country}>
              <mid-icon
                class="h-4 w-6 overflow-hidden rounded"
                library="country"
                name="${country}"
              ></mid-icon>
              - <span class="truncate">${countryLabelsNO[country]}</span>
            </mid-menu-item>`;
          })}
      </mid-menu>
    </mid-combobox>
  `,
};
