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
    defaultcountry: 'NO',
  },
  decorators: [
    (story) =>
      html`<div class="mb-64">
        ${story()}
        <pre class="pre"></pre>
      </div>`,
  ],
  render: ({ value, country, defaultcountry }: PhoneInputProps) => html`
    <mid-combobox class="combobox">
      <mid-phone-input
        class="input"
        slot="trigger"
        defaultcountry=${ifDefined(defaultcountry)}
        country=${ifDefined(country)}
        value=${ifDefined(value)}
      >
      </mid-phone-input>
      <mid-menu class="menu" style="--max-height: 14rem">
        <mid-search size="sm" class="search pb-4"></mid-search>
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
      var search = document.querySelector('.search');
      var combobox = document.querySelector('.combobox');

      menu.addEventListener('mid-select', ({ detail }) => {
        input.country = detail.item.value;
      });

      input.addEventListener('mid-change', () => {
        console.log('change', input.value, input.country);
      });

      input.addEventListener('mid-input', () => {
        console.log('input', input.value, input.country);
      });

      combobox.addEventListener('mid-after-show', () => {
        search.focus();
      });

      search.addEventListener('mid-input', () => {
        menu.filter((item) =>
          item.innerHTML.toLowerCase().includes(search.value.toLowerCase())
        );
      });
    </script>
  `,
};
