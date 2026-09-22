import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing, Part } from 'lit';
import '../components/combobox.component';
import '../components/menu.component';
import '../components/menu-item.component';
import '../components/phone-input.component';
import '../components/icon/icon.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { CountryCode, getCountries } from 'libphonenumber-js';
import { countryLabelsNo } from '../utilities/countries';
import { expect } from 'storybook/test';

type PhoneInputProps = Partial<{
  'mid-country-click': Event;
  'mid-change': Event;
  'mid-input': Event;
  'mid-focus': Event;
  'mid-blur': Event;
  value: string;
  country: CountryCode;
  label: string;
  description: string;
  descriptionSlot: string;
  hidelabel: boolean;
  hidedescription: boolean;
  invalidmessage: string;
  readonly: boolean;
  labelPart: Part;
  descriptionPart: Part;
  base: Part;
  field: Part;
  'country-button': Part;
  'phone-number': Part;
  'validation-message': Part;
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
    descriptionPart: {
      control: false,
      name: 'description',
      description: 'Select the description element',
      table: { category: 'css shadow parts' },
    },
    base: { control: false },
    field: { control: false },
    'country-button': { control: false },
    'phone-number': { control: false },
    'validation-message': { control: false },
    label: {
      type: 'string',
      description:
        'Label for the phone input. Passed label will be encapsulated by a label element.',
      table: { category: 'attributes' },
    },
    description: {
      type: 'string',
      description: 'Description shown between the label and the input.',
      table: { category: 'attributes' },
    },
    descriptionSlot: {
      name: 'description',
      type: 'string',
      description:
        'The description if you need HTML. Alternatively, use the `description` attribute.',
      table: { category: 'slots' },
    },
    invalidmessage: {
      type: 'string',
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
    description,
    descriptionSlot,
    hidelabel,
    hidedescription,
    invalidmessage,
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
        description=${ifDefined(description)}
        invalidmessage=${ifDefined(invalidmessage)}
        ?hidelabel=${hidelabel}
        ?hidedescription=${hidedescription}
        ?readonly=${readonly}
      >
        ${descriptionSlot
          ? html`<span slot="description">${descriptionSlot}</span>`
          : nothing}
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
              <span class="truncate">${countryLabelsNo[country]}</span>
            </mid-menu-item>`;
          })}
      </mid-menu>
    </mid-combobox>
  `,
};

/**
 * `description` renders help text between the label and the input and wires it
 * to the input through `aria-describedby`, ahead of the validation message when
 * `invalidmessage` is set. Use the `description` slot when the text needs HTML.
 *
 * The error is set from the play function rather than as an attribute: the
 * component clears `invalidmessage` whenever its value syncs (on connect and on
 * every keystroke), so pages set it after the fact, typically from a server
 * response or a `mid-invalid-show` handler.
 */
export const Description: Story = {
  args: {
    country: 'NO',
    label: 'Mobilnummer',
    description: 'Vi sender en engangskode til dette nummeret',
  },
  decorators: [(story) => html`<div class="w-100">${story()}</div>`],
  render: ({ country, label, description }: PhoneInputProps) => html`
    <mid-phone-input
      class="w-full"
      country=${ifDefined(country)}
      label=${ifDefined(label)}
      description=${ifDefined(description)}
    ></mid-phone-input>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('mid-phone-input')!;
    await el.updateComplete;
    const root = el.shadowRoot!;
    const input = root.querySelector('input')!;
    const desc = root.querySelector('[part="description"]')!;
    const validation = root.querySelector('[part="validation-message"]')!;

    // Without an error only the description is described.
    await expect(desc.textContent!.trim()).toBe(
      'Vi sender en engangskode til dette nummeret'
    );
    await expect(desc.getAttribute('aria-hidden')).toBe('true');
    await expect(input.getAttribute('aria-describedby')).toBe(desc.id);
    await expect(input.getAttribute('aria-invalid')).toBe('false');
    await expect(input.getAttribute('aria-errormessage')).toBeNull();

    // The live region is always in the DOM, empty and flat until there is a message.
    await expect(validation.getAttribute('aria-live')).toBe('polite');
    await expect(validation.textContent!.trim()).toBe('');
    await expect(validation.getBoundingClientRect().height).toBeLessThan(2);

    // With an error both are described, description first.
    el.invalidmessage = 'Mobilnummeret må ha 8 siffer';
    await el.updateComplete;
    await expect(input.getAttribute('aria-describedby')).toBe(
      `${desc.id} ${validation.id}`
    );
    await expect(input.getAttribute('aria-errormessage')).toBe(validation.id);
    await expect(input.getAttribute('aria-invalid')).toBe('true');
    await expect(validation.textContent).toContain(
      'Mobilnummeret må ha 8 siffer'
    );
    await expect(validation.getBoundingClientRect().height).toBeGreaterThan(2);

    // Clearing the error leaves the same region in place.
    el.invalidmessage = '';
    await el.updateComplete;
    await expect(root.querySelector('[part="validation-message"]')).toBe(
      validation
    );
    await expect(input.getAttribute('aria-describedby')).toBe(desc.id);
    await expect(validation.textContent!.trim()).toBe('');

    // A slotted description is described too.
    const late = document.createElement('mid-phone-input');
    late.setAttribute('label', 'Mobilnummer');
    const slotted = document.createElement('span');
    slotted.slot = 'description';
    slotted.textContent = 'Med landkode';
    late.appendChild(slotted);
    canvasElement.appendChild(late);
    await late.updateComplete;
    const lateDesc = late.shadowRoot!.querySelector('[part="description"]')!;
    const lateSlot = lateDesc.querySelector('slot') as HTMLSlotElement;
    await expect(lateSlot.assignedElements()).toEqual([slotted]);
    await expect(
      late.shadowRoot!.querySelector('input')!.getAttribute('aria-describedby')
    ).toBe(lateDesc.id);
    late.remove();
  },
};

/**
 * `hidedescription` hides the description visually while keeping it in
 * `aria-describedby`, for a field that sits under a heading or paragraph that
 * already says the same thing. It is independent of `hidelabel`, which hides
 * only the label.
 */
export const HideDescription: Story = {
  args: {
    country: 'NO',
    label: 'Mobilnummer',
    description: 'Vi sender en engangskode til dette nummeret',
    hidedescription: true,
  },
  decorators: [(story) => html`<div class="w-100">${story()}</div>`],
  render: ({
    country,
    label,
    description,
    hidedescription,
  }: PhoneInputProps) => html`
    <mid-phone-input
      class="w-full"
      country=${ifDefined(country)}
      label=${ifDefined(label)}
      description=${ifDefined(description)}
      ?hidedescription=${hidedescription}
    ></mid-phone-input>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('mid-phone-input')!;
    await el.updateComplete;
    const root = el.shadowRoot!;
    const input = root.querySelector('input')!;
    const label = root.querySelector('label')!;
    const desc = root.querySelector('[part="description"]')!;
    const countryButton = root.querySelector('[part="country-button"]')!;

    // The description is clipped away, the label is not.
    await expect(desc.classList).toContain('sr-only');
    await expect(label.classList).not.toContain('sr-only');
    await expect(desc.getBoundingClientRect().height).toBeLessThan(2);
    await expect(label.getBoundingClientRect().height).toBeGreaterThan(2);

    // Still reachable for screen readers: the input points at it by id.
    await expect(input.getAttribute('aria-describedby')).toBe(desc.id);
    await expect(desc.textContent!.trim()).toBe(
      'Vi sender en engangskode til dette nummeret'
    );

    // hidelabel hides only the label; the country button and input stay visible.
    el.hidelabel = true;
    await el.updateComplete;
    await expect(label.classList).toContain('sr-only');
    await expect(desc.classList).toContain('sr-only');
    await expect(input.getBoundingClientRect().height).toBeGreaterThan(2);
    await expect(countryButton.getBoundingClientRect().height).toBeGreaterThan(
      2
    );
  },
};
