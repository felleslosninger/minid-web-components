import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing, Part } from 'lit';
import '../components/phone-input.component';
import '../components/button.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { CountryCode, getCountries } from 'libphonenumber-js';
import { expect, userEvent, waitFor } from 'storybook/test';
import type { MinidPhoneInput } from '../components/phone-input.component';

type PhoneInputProps = Partial<{
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
  required: boolean;
  size: 'sm' | 'md' | 'lg';
  labelPart: Part;
  descriptionPart: Part;
  base: Part;
  field: Part;
  'country-input': Part;
  'country-list': Part;
  'phone-number': Part;
  'validation-message': Part;
}>;

const meta: Meta = {
  title: 'Komponenter/Phone Input',
  component: 'mid-phone-input',
  argTypes: {
    country: { control: { type: 'select' }, options: getCountries() },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    'mid-change': { control: false },
    'mid-input': { control: false },
    'mid-focus': { control: false },
    'mid-blur': { control: false },
    labelPart: {
      control: false,
      name: 'label',
      description: 'Select the legend element',
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
    'country-input': { control: false },
    'country-list': { control: false },
    'phone-number': { control: false },
    'validation-message': { control: false },
    label: {
      type: 'string',
      description:
        'Label for the field. Rendered as the legend of the group that holds the country code and the number.',
      table: { category: 'attributes' },
    },
    description: {
      type: 'string',
      description: 'Description shown between the label and the inputs.',
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
};

export default meta;

type Story = StoryObj<PhoneInputProps>;

const shadow = (el: MinidPhoneInput) => {
  const root = el.shadowRoot!;
  return {
    root,
    country: root.querySelector<HTMLInputElement>('[part="country-input"]')!,
    number: root.querySelector<HTMLInputElement>('[part="phone-number"]')!,
    list: root.querySelector<HTMLElement>('[part="country-list"]')!,
    legend: root.querySelector<HTMLLegendElement>('legend')!,
    visibleOptions: () =>
      Array.from(root.querySelectorAll<HTMLOptionElement>('u-option')).filter(
        (o) => !o.hidden && o.getAttribute('aria-hidden') !== 'true'
      ),
  };
};

/**
 * The country code sits in its own control to the left of the number and
 * defaults to Norway (+47). Focus it and type a dial code (`46`, `+46`), an
 * ISO code (`SE`) or a name (`Sve`) to filter the list, then pick with the
 * arrow keys and Enter, or click. A full international number typed or
 * pasted into the number field (`+46 70 123 45 67`, `0046…`) switches the
 * country and keeps the national part.
 *
 * The form value is the E.164 number (`+4799999999`), or empty when no
 * number has been entered.
 */
export const Main: Story = {
  args: {
    country: 'NO',
    label: 'Mobilnummer',
  },
  decorators: [
    (story) => html`<div lang="nb" class="mb-74 w-100">${story()}</div> `,
  ],
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
    required,
    size,
  }: PhoneInputProps) => html`
    <mid-phone-input
      class="w-full"
      country=${ifDefined(country)}
      value=${ifDefined(value)}
      label=${ifDefined(label)}
      description=${ifDefined(description)}
      invalidmessage=${ifDefined(invalidmessage)}
      size=${ifDefined(size)}
      ?hidelabel=${hidelabel}
      ?hidedescription=${hidedescription}
      ?readonly=${readonly}
      ?required=${required}
    >
      ${descriptionSlot
        ? html`<span slot="description">${descriptionSlot}</span>`
        : nothing}
    </mid-phone-input>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('mid-phone-input')!;
    await el.updateComplete;
    const { country, number, legend, list } = shadow(el);

    // The label is the legend of the group; both controls carry their own
    // screen-reader-only labels.
    await expect(legend.textContent!.trim()).toBe('Mobilnummer');
    await expect(country.labels![0].textContent!.trim()).toBe('Landskode');
    await expect(number.labels![0].textContent!.trim()).toBe('Telefonnummer');

    // Norway by default, and the country name is the combobox description.
    await expect(el.country).toBe('NO');
    await expect(el.countrycode).toBe('+47');
    await expect(country.value).toBe('+47');
    await expect(country.getAttribute('aria-describedby')).toBeTruthy();
    await expect(
      el.shadowRoot!.getElementById(country.getAttribute('aria-describedby')!)!
        .textContent
    ).toBe('Norge');
    await expect(list.getAttribute('role')).toBe('listbox');

    // The number input is described by the selected country code first, so a
    // user sent straight to it (page-load focus) learns about the control in
    // front of it.
    const hint = el.shadowRoot!.getElementById(
      number.getAttribute('aria-describedby')!.split(' ')[0]
    )!;
    await expect(hint.textContent!.trim()).toBe(
      'Landskode +47 (Norge) er valgt i feltet foran.'
    );
    await expect(hint.getAttribute('aria-hidden')).toBe('true');

    // Empty until a number is typed.
    await expect(el.value).toBe('');
    await expect(number.getAttribute('type')).toBe('tel');
  },
};

/**
 * Typing in the country control filters the list by name, ISO code or dial
 * code. Enter picks the highlighted country; the control then shows the
 * dial code and the number keeps its national part. Leaving the control with
 * unambiguous free text (`dk`, `+1`, `Sverige`) selects that country too;
 * ambiguous text (`sve`) keeps the current one.
 */
export const CountrySearch: Story = {
  args: { country: 'NO', label: 'Mobilnummer' },
  decorators: [
    (story) => html`<div lang="nb" class="mb-74 w-100">${story()}</div>`,
  ],
  render: ({ country, label }: PhoneInputProps) => html`
    <mid-phone-input
      class="w-full"
      country=${ifDefined(country)}
      label=${ifDefined(label)}
    ></mid-phone-input>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('mid-phone-input')!;
    await el.updateComplete;
    const { root, country, number, visibleOptions } = shadow(el);

    // A real click selects the dial code so typing replaces it; user-event
    // places its own caret, so the selection is given explicitly here.
    const replaceWith = (text: string) =>
      userEvent.type(country, text, {
        initialSelectionStart: 0,
        initialSelectionEnd: country.value.length,
      });

    await replaceWith('46');
    await expect(root.activeElement).toBe(country);
    await waitFor(() =>
      expect(visibleOptions().map((o) => o.value)).toEqual(['SE'])
    );

    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(el.country).toBe('SE'));
    await expect(el.countrycode).toBe('+46');
    await waitFor(() => expect(country.value).toBe('+46'));
    await expect(country.getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(number);
    await userEvent.keyboard('701234567');
    await expect(el.nationalnumber).toBe('701234567');
    await expect(el.value).toBe('+46701234567');

    // Free text (an ISO code, a dial code, a unique name) resolves on blur
    // as well, but u-combobox only reads trusted input events for that, so it
    // is verified by hand rather than here.
  },
};

/**
 * A full international number in the number field, as typed, pasted or
 * autofilled, moves the country code to the country control.
 */
export const PasteInternational: Story = {
  args: { country: 'NO', label: 'Mobilnummer' },
  decorators: [
    (story) => html`<div lang="nb" class="mb-74 w-100">${story()}</div>`,
  ],
  render: ({ country, label }: PhoneInputProps) => html`
    <mid-phone-input
      class="w-full"
      country=${ifDefined(country)}
      label=${ifDefined(label)}
    ></mid-phone-input>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('mid-phone-input')!;
    await el.updateComplete;
    const { country, number } = shadow(el);
    const root = el.shadowRoot!;
    const status = root.querySelector('[role="status"]')!;
    const hint = root.getElementById(
      number.getAttribute('aria-describedby')!.split(' ')[0]
    )!;

    const fill = async (text: string) => {
      number.focus();
      number.value = text;
      number.dispatchEvent(new InputEvent('input', { bubbles: true }));
      await el.updateComplete;
    };

    await fill('+47 99999999');
    await expect(el.country).toBe('NO');
    await expect(number.value).toBe('99 99 99 99');
    await expect(el.value).toBe('+4799999999');
    // Same country: nothing to announce
    await expect(status.textContent!.trim()).toBe('');

    await fill('+46 70 123 45 67');
    await waitFor(() => expect(el.country).toBe('SE'));
    await expect(el.countrycode).toBe('+46');
    await waitFor(() => expect(country.value).toBe('+46'));
    // Shown the way Sweden writes it, trunk prefix included
    await expect(number.value).toBe('070-123 45 67');
    await expect(el.value).toBe('+46701234567');
    // The switch happened behind the user's back: announce it, and the number
    // field's description follows.
    await waitFor(() =>
      expect(status.textContent!.trim()).toBe(
        'Landskode endret til +46 (Sverige).'
      )
    );
    await expect(hint.textContent!.trim()).toBe(
      'Landskode +46 (Sverige) er valgt i feltet foran.'
    );

    await fill('0045 12 34 56 78');
    await waitFor(() => expect(el.country).toBe('DK'));
    await expect(el.value).toBe('+4512345678');
    await waitFor(() =>
      expect(status.textContent!.trim()).toBe(
        'Landskode endret til +45 (Danmark).'
      )
    );

    // A national number stays with the selected country.
    await fill('87654321');
    await expect(el.country).toBe('DK');
    await expect(el.value).toBe('+4587654321');
  },
};

/**
 * The component follows the nearest `lang` (its own attribute, an ancestor's,
 * or `<html lang>`). The control labels and the live "N land" announcement
 * come from the component translations (nb, nn, se, en). Country names come
 * from the `countryLabels*` tables in `@felleslosninger/minid-elements/countries`:
 * bokmål and English are hand-curated, nynorsk and Northern Sami are
 * generated from CLDR. Other languages fall back to bokmål.
 */
export const Languages: Story = {
  decorators: [(story) => html`<div class="w-100">${story()}</div>`],
  render: () => html`
    <div class="flex flex-col gap-6">
      <mid-phone-input
        lang="nb"
        label="Mobilnummer (nb)"
        country="SE"
      ></mid-phone-input>
      <mid-phone-input
        lang="nn"
        label="Mobilnummer (nn)"
        country="CH"
      ></mid-phone-input>
      <mid-phone-input
        lang="en"
        label="Mobile number (en)"
        country="SE"
      ></mid-phone-input>
      <mid-phone-input
        lang="se"
        label="Mobiilnummar (se)"
        country="SE"
      ></mid-phone-input>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const expectations: Record<string, [string, string, string]> = {
      nb: [
        'Landskode',
        'Sverige',
        'Landskode +46 (Sverige) er valgt i feltet foran.',
      ],
      nn: [
        'Landskode',
        'Sveits',
        'Landskode +41 (Sveits) er vald i feltet framfor.',
      ],
      en: [
        'Country code',
        'Sweden',
        'Country code +46 (Sweden) is selected in the previous field.',
      ],
      se: [
        'Riikkakoda',
        'Ruoŧŧa',
        'Riikkakoda +46 (Ruoŧŧa) lea válljejuvvon ovddit gieddis.',
      ],
    };
    for (const el of Array.from(
      canvasElement.querySelectorAll('mid-phone-input')
    )) {
      await el.updateComplete;
      const [countryCode, name, hint] = expectations[el.getAttribute('lang')!];
      const { country, number } = shadow(el);
      await expect(country.labels![0].textContent!.trim()).toBe(countryCode);
      await expect(
        el.shadowRoot!.getElementById(
          country.getAttribute('aria-describedby')!
        )!.textContent
      ).toBe(name);
      await expect(
        el
          .shadowRoot!.getElementById(
            number.getAttribute('aria-describedby')!.split(' ')[0]
          )!
          .textContent!.trim()
      ).toBe(hint);
    }
  },
};

/**
 * `description` renders help text between the label and the inputs and wires
 * it to the number input through `aria-describedby`, ahead of the validation
 * message when `invalidmessage` is set. Use the `description` slot when the
 * text needs HTML.
 *
 * The error is set from the play function rather than as an attribute: the
 * component clears `invalidmessage` whenever its value syncs (on every
 * keystroke), so pages set it after the fact, typically from a server
 * response or a `mid-invalid-show` handler.
 */
export const Description: Story = {
  args: {
    country: 'NO',
    label: 'Mobilnummer',
    description: 'Vi sender en engangskode til dette nummeret',
  },
  decorators: [(story) => html`<div lang="nb" class="w-100">${story()}</div>`],
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
    const input = root.querySelector<HTMLInputElement>(
      '[part="phone-number"]'
    )!;
    const desc = root.querySelector('[part="description"]')!;
    const validation = root.querySelector('[part="validation-message"]')!;
    const hint = root.getElementById(
      input.getAttribute('aria-describedby')!.split(' ')[0]
    )!;

    // Without an error: the country-code hint, then the description.
    await expect(desc.textContent!.trim()).toBe(
      'Vi sender en engangskode til dette nummeret'
    );
    await expect(desc.getAttribute('aria-hidden')).toBe('true');
    await expect(input.getAttribute('aria-describedby')).toBe(
      `${hint.id} ${desc.id}`
    );
    await expect(input.getAttribute('aria-invalid')).toBe('false');
    await expect(input.getAttribute('aria-errormessage')).toBeNull();

    // The live region is always in the DOM, empty and flat until there is a message.
    await expect(validation.getAttribute('aria-live')).toBe('polite');
    await expect(validation.textContent!.trim()).toBe('');
    await expect(validation.getBoundingClientRect().height).toBeLessThan(2);

    // With an error all three, the error last.
    el.invalidmessage = 'Mobilnummeret må ha 8 siffer';
    await el.updateComplete;
    await expect(input.getAttribute('aria-describedby')).toBe(
      `${hint.id} ${desc.id} ${validation.id}`
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
    await expect(input.getAttribute('aria-describedby')).toBe(
      `${hint.id} ${desc.id}`
    );
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
      late
        .shadowRoot!.querySelector('[part="phone-number"]')!
        .getAttribute('aria-describedby')!
        .split(' ')
    ).toContain(lateDesc.id);
    late.remove();
  },
};

/**
 * `hidedescription` hides the description visually while keeping it in
 * `aria-describedby`, for a field that sits under a heading or paragraph that
 * already says the same thing. It is independent of `hidelabel`, which hides
 * only the legend.
 */
export const HideDescription: Story = {
  args: {
    country: 'NO',
    label: 'Mobilnummer',
    description: 'Vi sender en engangskode til dette nummeret',
    hidedescription: true,
  },
  decorators: [(story) => html`<div lang="nb" class="w-100">${story()}</div>`],
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
    const { root, country, number, legend } = shadow(el);
    const desc = root.querySelector('[part="description"]')!;

    // The description is clipped away, the legend is not.
    await expect(desc.classList).toContain('sr-only');
    await expect(legend.classList).not.toContain('sr-only');
    await expect(desc.getBoundingClientRect().height).toBeLessThan(2);
    await expect(legend.getBoundingClientRect().height).toBeGreaterThan(2);

    // Still reachable for screen readers: the number input points at it by id.
    await expect(number.getAttribute('aria-describedby')!.split(' ')).toContain(
      desc.id
    );
    await expect(desc.textContent!.trim()).toBe(
      'Vi sender en engangskode til dette nummeret'
    );

    // hidelabel hides only the legend; the inputs stay visible.
    el.hidelabel = true;
    await el.updateComplete;
    await expect(legend.classList).toContain('sr-only');
    await expect(desc.classList).toContain('sr-only');
    await expect(number.getBoundingClientRect().height).toBeGreaterThan(2);
    await expect(country.getBoundingClientRect().height).toBeGreaterThan(2);
  },
};

/**
 * `readonly` locks both controls: the country code becomes a plain read-only
 * input (no combobox, no list) and Designsystemet marks the legend with the
 * read-only icon because every input in the fieldset is read-only.
 */
export const Readonly: Story = {
  args: {
    value: '+4799999999',
    label: 'Mobilnummer',
    readonly: true,
  },
  decorators: [(story) => html`<div lang="nb" class="w-100">${story()}</div>`],
  render: ({ value, label, readonly }: PhoneInputProps) => html`
    <mid-phone-input
      class="w-full"
      value=${ifDefined(value)}
      label=${ifDefined(label)}
      ?readonly=${readonly}
    ></mid-phone-input>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('mid-phone-input')!;
    await el.updateComplete;
    const { root, country, number } = shadow(el);

    await expect(el.country).toBe('NO');
    await expect(number.value).toBe('99 99 99 99');
    await expect(el.value).toBe('+4799999999');
    await expect(country.readOnly).toBe(true);
    await expect(number.readOnly).toBe(true);

    // No combobox at all: a plain read-only input with its label and the
    // country name as description.
    await expect(root.querySelector('[part="country-list"]')).toBeNull();
    await expect(country.getAttribute('role')).toBeNull();
    await expect(country.getAttribute('aria-expanded')).toBeNull();
    await expect(country.labels![0].textContent!.trim()).toBe('Landskode');
    await expect(
      root.getElementById(country.getAttribute('aria-describedby')!)!
        .textContent
    ).toBe('Norge');
  },
};

/**
 * With `required`, an empty number fails validation on submit: the form
 * value is empty until a national number is entered, so the browser's
 * `invalid` event reaches the component and `mid-invalid-show` fires with
 * `validity.valueMissing`.
 */
export const Required: Story = {
  args: { label: 'Mobilnummer', required: true },
  decorators: [
    (story) => html`<div lang="nb" class="mb-74 w-100">${story()}</div>`,
  ],
  render: ({ label, required }: PhoneInputProps) => html`
    <form @submit=${(e: Event) => e.preventDefault()}>
      <mid-phone-input
        class="w-full"
        name="mobile"
        label=${ifDefined(label)}
        ?required=${required}
      ></mid-phone-input>
      <mid-button class="mt-4" type="submit">Send</mid-button>
    </form>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('mid-phone-input')!;
    await el.updateComplete;
    const { number } = shadow(el);
    const form = canvasElement.querySelector('form')!;

    let shown: CustomEvent | undefined;
    el.addEventListener('mid-invalid-show', (e) => (shown = e as CustomEvent), {
      once: true,
    });
    await expect(new FormData(form).get('mobile')).toBe('');
    await expect(el.checkValidity()).toBe(false);

    form.requestSubmit();
    await waitFor(() => expect(shown).toBeDefined());
    await expect(shown!.detail.validity.valueMissing).toBe(true);
    await el.updateComplete;
    await expect(number.getAttribute('aria-invalid')).toBe('true');
    await expect(el.invalidmessage).not.toBe('');

    // A number clears it.
    await userEvent.click(number);
    await userEvent.keyboard('99999999');
    await expect(el.checkValidity()).toBe(true);
    await expect(new FormData(form).get('mobile')).toBe('+4799999999');
    await expect(number.getAttribute('aria-invalid')).toBe('false');
  },
};
