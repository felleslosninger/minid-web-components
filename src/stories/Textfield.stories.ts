import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../components/textfield.component';
import '../components/button.component';
import { MinidTextfield } from '../components/textfield.component';
import { html, nothing, Part } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { type MaskType } from 'maska';
import { expect } from 'storybook/test';
import { getLang } from '../utilities/lang';
import { getTranslations } from '../utilities/translations';

type TextfieldProps = Partial<{
  label: string;
  labelAttr: string;
  name: string;
  value: string;
  placeholder: string;
  type: MinidTextfield['type'];
  inputmode: MinidTextfield['inputmode'];
  size: 'sm' | 'md' | 'lg';
  prefix: string;
  suffix: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  description: string;
  clearable: boolean;
  hidelabel: boolean;
  passwordtoggle: boolean;
  passwordvisible: boolean;
  pattern: string;
  mask: MaskType;
  autocomplete: string;
  autofocus: boolean;
  minlength: number;
  maxlength: number;
  min: number;
  max: number;
  invalidmessage: string;
  input: Part;
  base: Part;
  field: Part;
  'clear-button': Part;
  'password-toggle-button': Part;
  'mid-change': Event;
  'mid-input': Event;
  'mid-clear': Event;
  'mid-focus': Event;
  'mid-blur': Event;
  'mid-invalid-show': Event;
  'mid-invalid-hide': Event;
  inputId: never;
  descriptionId: never;
}>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Textfield',
  tags: ['autodocs'],
  component: 'mid-textfield',
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    min: { type: 'number' },
    max: { type: 'number' },
    minlength: { type: 'number' },
    maxlength: { type: 'number' },
    autocomplete: { type: 'string' },
    placeholder: { type: 'string' },
    labelAttr: {
      name: 'label',
      type: 'string',
      table: { category: 'attributes', defaultValue: { summary: '' } },
    },
    name: {
      type: 'string',
      table: { category: 'attributes' },
    },
    type: {
      control: { type: 'select' },
      options: [
        'date',
        'datetime-local',
        'email',
        'file',
        'month',
        'number',
        'password',
        'search',
        'tel',
        'text',
        'time',
        'url',
        'week',
      ],
    },
    inputmode: {
      control: { type: 'select' },
      options: [
        'none',
        'text',
        'tel',
        'url',
        'email',
        'numeric',
        'decimal'
      ],
    },
    pattern: { type: 'string' },
    mask: { type: 'string' },
    'mid-change': { control: { disable: true } },
    'mid-input': { control: { disable: true } },
    'mid-clear': { control: { disable: true } },
    'mid-focus': { control: { disable: true } },
    'mid-blur': { control: { disable: true } },
    'mid-invalid-show': { control: { disable: true } },
    'mid-invalid-hide': { control: { disable: true } },
    field: { control: { disable: true } },
    'clear-button': { control: { disable: true } },
    'password-toggle-button': { control: { disable: true } },
    input: { control: { disable: true } },
    base: { control: { disable: true } },
    descriptionId: { table: { disable: true } },
    inputId: { table: { disable: true } },
  },
} satisfies Meta<TextfieldProps>;

export default meta;
type Story = StoryObj<TextfieldProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Main: Story = {
  args: {
    labelAttr: 'Tekst input',
  },
  decorators: [(story) => html`<div class="w-100">${story()}</div>`],
  render: ({
    labelAttr,
    label,
    placeholder,
    size,
    type,
    inputmode,
    value,
    name,
    prefix,
    suffix,
    disabled,
    clearable,
    hidelabel,
    readonly,
    required,
    description,
    passwordtoggle,
    passwordvisible,
    pattern,
    mask,
    autocomplete,
    autofocus,
    min,
    max,
    minlength,
    maxlength,
    invalidmessage,
  }: TextfieldProps) =>
    html`<mid-textfield
      ?disabled=${disabled}
      ?autofocus=${autofocus}
      ?clearable=${clearable}
      ?readonly=${readonly}
      ?required=${required}
      ?hideLabel=${hidelabel}
      ?passwordtoggle=${passwordtoggle}
      ?passwordvisible=${passwordvisible}
      invalidmessage=${ifDefined(invalidmessage)}
      autocomplete=${ifDefined(autocomplete)}
      description=${ifDefined(description)}
      label="${ifDefined(labelAttr)}"
      value=${ifDefined(value)}
      name=${ifDefined(name)}
      placeholder=${ifDefined(placeholder)}
      pattern=${ifDefined(pattern)}
      type=${ifDefined(type)}
      inputmode=${ifDefined(inputmode)}
      size=${ifDefined(size)}
      min=${ifDefined(min)}
      max=${ifDefined(max)}
      minlength=${ifDefined(minlength)}
      maxlength=${ifDefined(maxlength)}
      mask=${ifDefined(mask ?? undefined)}
    >
      ${prefix ? html`<span slot="prefix">${prefix}</span>` : nothing}
      ${suffix ? html`<span slot="suffix">${suffix}</span>` : nothing}
      ${label ? html`<span slot="label">${label}</span>` : nothing}
    </mid-textfield>`,
};

/**
 * Guards the password toggle contract. The eye is overlaid inside the field
 * rather than rendered as a ds-field-affix, so the things that used to be free
 * - it being in the tab order, its name carrying the state, it not disturbing
 * the input - are now this component's responsibility.
 */
export const PasswordToggle: Story = {
  args: {
    labelAttr: 'Passord',
    type: 'password',
    passwordtoggle: true,
    minlength: 8,
  },
  render: ({ labelAttr, type, passwordtoggle, minlength }: TextfieldProps) => html`
    <form @submit=${(e: Event) => e.preventDefault()}>
      <mid-textfield
        name="password"
        label=${ifDefined(labelAttr)}
        type=${ifDefined(type)}
        minlength=${ifDefined(minlength)}
        ?passwordtoggle=${passwordtoggle}
      ></mid-textfield>
    </form>
  `,
  play: async ({ canvasElement, userEvent }) => {
    const el = canvasElement.querySelector('mid-textfield')!;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    const toggle = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[part="password-toggle-button"]'
    )!;

    // The eye is overlaid, not wrapped in an affix box.
    await expect(toggle.tagName).toBe('BUTTON');
    await expect(toggle.getAttribute('type')).toBe('button');
    await expect(toggle.closest('.ds-field-affix')).toBeNull();
    await expect(
      el.shadowRoot!.querySelector('[part="base"]')!.classList
    ).toContain('has-field-buttons');

    // Reachable by keyboard, and after the input in the tab order. A published
    // build once shipped this with tabindex="-1", which took it out entirely.
    // (userEvent.tab() walks the light DOM only, so assert the two things the
    // browser's own tab order is built from instead.)
    await expect(toggle.getAttribute('tabindex')).toBeNull();
    await expect(toggle.disabled).toBe(false);
    await expect(
      input.compareDocumentPosition(toggle) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    toggle.focus();
    await expect(el.shadowRoot!.activeElement).toBe(toggle);

    // State rides on the accessible name, and on the icon.
    const t = getTranslations(getLang(el));
    await expect(toggle.getAttribute('aria-label')).toBe(t.showPassword);
    await expect(toggle.getAttribute('aria-controls')).toBe(input.id);
    await expect(
      toggle.querySelector('mid-icon')!.getAttribute('name')
    ).toBe('eye');

    // Space and Enter both flip it, both ways.
    await userEvent.keyboard(' ');
    await el.updateComplete;
    await expect(input.type).toBe('text');
    await expect(toggle.getAttribute('aria-label')).toBe(t.hidePassword);
    await expect(
      toggle.querySelector('mid-icon')!.getAttribute('name')
    ).toBe('eye-slash');

    await userEvent.keyboard('{Enter}');
    await el.updateComplete;
    await expect(input.type).toBe('password');
    await expect(toggle.getAttribute('aria-label')).toBe(t.showPassword);

    // The value survives the round trip.
    el.value = 'hemmelig1';
    await el.updateComplete;
    await userEvent.click(toggle);
    await el.updateComplete;
    await expect(input.type).toBe('text');
    await expect(el.value).toBe('hemmelig1');
    await expect(input.value).toBe('hemmelig1');

    // Clicking the eye must not blur the input: WebKit sends focus to <body>
    // on button mousedown, the host blurs, and FormControlMixin validates on
    // blur - popping an error for a password the user hasn't finished typing.
    // Chromium retargets the focus move so the blur path never fires here;
    // in this chromium-only run, the activeElement assertion is the one that
    // actually detects removal of the mousedown guard.
    el.value = 'kort';
    await el.updateComplete;
    const events: string[] = [];
    for (const name of ['mid-invalid-show', 'mid-invalid-hide']) {
      el.addEventListener(name, () => events.push(name));
    }
    input.focus();
    await userEvent.click(toggle);
    await el.updateComplete;
    await expect(events).not.toContain('mid-invalid-show');
    await expect(el.shadowRoot!.activeElement).toBe(input);
  },
};

/**
 * The affix fallback: with anything else in the field (a prefix here), the eye
 * renders as a ds-field-affix instead of the overlay - but it must stay the
 * same button: same part, same accessible name, same scaling icon, and Edge's
 * native reveal control stays suppressed.
 */
export const PasswordToggleWithPrefix: Story = {
  args: {
    labelAttr: 'Passord',
    type: 'password',
    passwordtoggle: true,
    prefix: 'NO',
  },
  render: ({ labelAttr, type, passwordtoggle, prefix }: TextfieldProps) => html`
    <mid-textfield
      name="password"
      label=${ifDefined(labelAttr)}
      type=${ifDefined(type)}
      ?passwordtoggle=${passwordtoggle}
    >
      <span slot="prefix">${prefix}</span>
    </mid-textfield>
  `,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('mid-textfield')!;
    await el.updateComplete;

    const base = el.shadowRoot!.querySelector('[part="base"]')!;
    const input = el.shadowRoot!.querySelector('input')!;
    const toggle = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[part="password-toggle-button"]'
    )!;

    // Affix mode, not overlay - and never both classes at once, since the
    // overlay's display:block would break the affix flex row.
    await expect(base.classList).toContain('ds-field-affixes');
    await expect(base.classList).not.toContain('has-field-buttons');

    // The part stays on the button itself, wrapped in the affix span.
    await expect(toggle.tagName).toBe('BUTTON');
    await expect(toggle.closest('.ds-field-affix')).not.toBeNull();

    // Edge's native reveal control is suppressed in this mode too.
    await expect(input.classList).toContain('password-toggle-input');

    // The prefix affix and the input share one flex row.
    const prefixBox = el
      .shadowRoot!.querySelector('.ds-field-affix')!
      .getBoundingClientRect();
    const inputBox = input.getBoundingClientRect();
    await expect(prefixBox.top < inputBox.bottom).toBe(true);
    await expect(inputBox.top < prefixBox.bottom).toBe(true);
    await expect(prefixBox.right <= inputBox.left + 1).toBe(true);
  },
};

/**
 * The clear button rides the same in-field rail as the password toggle: it
 * appears inside the input's reserved gutter once the field has a value, and
 * activating it must clear without stealing focus or flashing validation.
 */
export const Clearable: Story = {
  args: {
    labelAttr: 'Melding',
    clearable: true,
    minlength: 8,
  },
  render: ({ labelAttr, clearable, minlength }: TextfieldProps) => html`
    <mid-textfield
      name="message"
      label=${ifDefined(labelAttr)}
      minlength=${ifDefined(minlength)}
      ?clearable=${clearable}
    ></mid-textfield>
  `,
  play: async ({ canvasElement, userEvent }) => {
    const el = canvasElement.querySelector('mid-textfield')!;
    await el.updateComplete;

    const base = el.shadowRoot!.querySelector('[part="base"]')!;
    const input = el.shadowRoot!.querySelector('input')!;

    // Overlay mode with one reserved slice; the button itself only exists
    // once there is something to clear, but the gutter is reserved up front
    // so the text does not shift when it appears.
    await expect(base.classList).toContain('has-field-buttons');
    await expect(base.classList).not.toContain('has-field-buttons--two');
    await expect(base.classList).not.toContain('ds-field-affixes');
    await expect(el.shadowRoot!.querySelector('[part="clear-button"]')).toBeNull();
    const emptyPadding = getComputedStyle(input).paddingInlineEnd;

    input.focus();
    await userEvent.keyboard('kort');
    await el.updateComplete;

    const clear = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[part="clear-button"]'
    )!;
    await expect(clear.tagName).toBe('BUTTON');
    await expect(clear.closest('.field-buttons')).not.toBeNull();
    await expect(getComputedStyle(input).paddingInlineEnd).toBe(emptyPadding);

    // Clearing a half-typed too-short value must not blur-validate (the same
    // mousedown guard as the eye) and must leave the caret in the input.
    const events: string[] = [];
    for (const name of ['mid-invalid-show', 'mid-invalid-hide']) {
      el.addEventListener(name, () => events.push(name));
    }
    await userEvent.click(clear);
    await el.updateComplete;
    await expect(el.value).toBe('');
    await expect(events).not.toContain('mid-invalid-show');
    await expect(el.shadowRoot!.activeElement).toBe(input);
  },
};

/**
 * Clearable and passwordtoggle together share the rail: two reserved slices,
 * trash before eye, both buttons carrying their own part.
 */
export const ClearableWithPasswordToggle: Story = {
  args: {
    labelAttr: 'Passord',
    type: 'password',
    passwordtoggle: true,
    clearable: true,
  },
  render: ({ labelAttr, type, passwordtoggle, clearable }: TextfieldProps) => html`
    <mid-textfield
      name="password"
      label=${ifDefined(labelAttr)}
      type=${ifDefined(type)}
      ?passwordtoggle=${passwordtoggle}
      ?clearable=${clearable}
    ></mid-textfield>
  `,
  play: async ({ canvasElement, userEvent }) => {
    const el = canvasElement.querySelector('mid-textfield')!;
    await el.updateComplete;

    const base = el.shadowRoot!.querySelector('[part="base"]')!;
    const input = el.shadowRoot!.querySelector('input')!;

    await expect(base.classList).toContain('has-field-buttons');
    await expect(base.classList).toContain('has-field-buttons--two');
    await expect(base.classList).not.toContain('ds-field-affixes');

    input.focus();
    await userEvent.keyboard('hemmelig1');
    await el.updateComplete;

    const clear = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[part="clear-button"]'
    )!;
    const toggle = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[part="password-toggle-button"]'
    )!;
    await expect(clear.tagName).toBe('BUTTON');
    await expect(toggle.tagName).toBe('BUTTON');

    // Both share the rail, trash before eye, inside the field's border.
    const clearBox = clear.getBoundingClientRect();
    const toggleBox = toggle.getBoundingClientRect();
    const inputBox = input.getBoundingClientRect();
    await expect(clearBox.right <= toggleBox.left + 1).toBe(true);
    await expect(toggleBox.right <= inputBox.right).toBe(true);

    // The toggle still works with the clear button present.
    await userEvent.click(toggle);
    await el.updateComplete;
    await expect(input.type).toBe('text');
    await expect(el.value).toBe('hemmelig1');
  },
};
