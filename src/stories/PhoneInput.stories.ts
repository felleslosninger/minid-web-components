import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../components/combobox.component';
import '../components/menu.component';
import '../components/menu-item.component';
import '../components/phone-input.component';
import '../components/icon/icon.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { CountryCode, getCountries } from 'libphonenumber-js';
import { countryLabelsNO } from '../components/utilities/countries';

type PhoneInputProps = {
  value?: string;
  defaultcountry?: CountryCode;
  country?: CountryCode;
};

const meta: Meta = {
  title: 'Komponenter/Phone Input',
  component: 'mid-phone-input',
  argTypes: {
    defaultcountry: { control: { type: 'select' }, options: getCountries() },
    country: { control: { type: 'select' }, options: getCountries() },
  },
};

export default meta;

type Story = StoryObj<PhoneInputProps>;

export const Main: Story = {
  args: {
    defaultcountry: 'GB',
  },
  decorators: [
    (story) =>
      html`<div class="mb-64">
        ${story()}
        <pre class="pre"></pre>
      </div>`,
  ],
  render: ({ value, country, defaultcountry }: PhoneInputProps) => html`
    <mid-combobox>
      <mid-phone-input
        class="input"
        defaultcountry=${ifDefined(defaultcountry)}
        country=${ifDefined(country)}
        value=${ifDefined(value)}
        slot="trigger"
      >
      </mid-phone-input>
      <mid-menu class="menu" style="--max-height: 14rem">
        ${getCountries()
          .sort((a, b) =>
            Array<CountryCode>('NO', 'PL', 'DK', 'SE', 'US', 'GB').includes(a)
              ? -1
              : a.localeCompare(b)
          )
          .slice(0, 10)
          .map((country) => {
            return html`<mid-menu-item value=${country}
              ><mid-icon
                class="h-4 w-6 overflow-hidden rounded"
                library="country"
                name="${country}"
              ></mid-icon>
              - <span class="truncate">${countryLabelsNO[country]}</span>
            </mid-menu-item>`;
          })}
      </mid-menu>
    </mid-combobox>
    <script>
      var input = document.querySelector('.input');
      var menu = document.querySelector('.menu');

      menu.addEventListener('mid-select', ({ detail }) => {
        input.country = detail.item.value;
      });
      input.addEventListener('mid-change', () => {
        console.log('change', input.value, input.country);
      });
      input.addEventListener('mid-input', () => {
        console.log('input', input.value, input.country);
      });
    </script>
  `,
};
