import type { Meta, StoryObj } from '@storybook/web-components';
import { html, Part } from 'lit';
import '../components/combobox.component';
import '../components/menu.component';
import '../components/menu-item.component';
import '../components/phone-input.component';
import '../components/icon/icon.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { CountryCode, getCountries } from 'libphonenumber-js';
import countryLabelsNO from '../utilities/country-labels-no';

type PhoneInputProps = Partial<{
  'mid-country-click': Event;
  'mid-change': Event;
  'mid-input': Event;
  'mid-focus': Event;
  'mid-blur': Event;
  value: string;
  country: CountryCode;
  label: string;
  hidelabel: boolean;
  readonly: boolean;
  labelPart: Part;
  base: Part;
  field: Part;
  'country-button': Part;
  input: Part;
}>;

const meta: Meta = {
  title: 'Komponenter/Phone Input',
  component: 'mid-phone-input',
  argTypes: {
    country: { control: { type: 'select' }, options: getCountries() },
    'mid-country-click': { control: false },
    'mid-change': { control: false },
    'mid-input': { control: false },
    'mid-focus': { control: false },
    'mid-blur': { control: false },
    labelPart: {
      control: false,
      name: 'label',
      description: 'Select the label element',
      table: { category: 'css shadow parts' },
    },
    base: { control: false },
    field: { control: false },
    'country-button': { control: false },
    input: { control: false },
    label: {
      type: 'string',
      description:
        'Label for the phone input. Passed label will be encapsulated by a label element.',
      table: { category: 'attributes' },
    },
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
  decorators: [(story) => html`<div class="mb-74 w-100">${story()}</div> `],
  render: ({
    value,
    country,
    label,
    hidelabel,
    readonly,
  }: PhoneInputProps) => html`
    <script>
      // A list of countries (localized to Norwegian) is provided to help creating the menu items in the dropdown
      // import countryLabelsNO  from '@felleslosninger/minid-elements/country-labels-no';
    </script>
    <mid-combobox>
      <mid-phone-input
        slot="trigger"
        class="phone-input w-full"
        country=${ifDefined(country)}
        value=${ifDefined(value)}
        label=${ifDefined(label)}
        ?hidelabel=${hidelabel}
        ?readonly=${readonly}
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
              <span class="truncate">${countryLabelsNO[country]}</span>
            </mid-menu-item>`;
          })}
      </mid-menu>
    </mid-combobox>
  `,
};
