import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing, Part } from 'lit';
import '../components/code-input.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { expect } from 'storybook/test';

type CodeInputProps = Partial<{
  length: number;
  minlength: number;
  value: string;
  label: string;
  labelAttr: string;
  descriptionSlot: string;
  descriptionAttr: string;
  type: 'number' | 'text';
  size: 'sm' | 'md' | 'lg';
  inputmode: 'numeric' | 'text';
  invalidmessage: string;
  pattern: string;
  autofocus: boolean;
  disabled: boolean;
  hidelabel: boolean;
  hidedescription: boolean;
  event: Event;
  'mid-change': Event;
  'mid-input': Event;
  'mid-complete': Event;
  'mid-invalid-show': Event;
  'mid-invalid-hide': Event;
  'input-container': Part;
  clear: Function;
  focus: Function;
}>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Code Input',
  component: 'mid-code-input',
  tags: ['beta'],
  argTypes: {
    value: { type: 'string' },
    pattern: { type: 'string' },
    minlength: { type: 'number' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    type: { control: 'radio', options: ['number', 'text'] },
    inputmode: { control: 'radio', options: ['numeric', 'text'] },
    labelAttr: {
      name: 'label',
      type: 'string',
      table: { category: 'attributes', defaultValue: { summary: '' } },
    },
    descriptionAttr: {
      name: 'description',
      type: 'string',
      table: { category: 'attributes', defaultValue: { summary: '' } },
    },
    descriptionSlot: {
      name: 'description',
      type: 'string',
      table: { category: 'slots' },
    },
    'mid-change': { control: { disable: true } },
    'mid-input': { control: { disable: true } },
    'mid-complete': { control: { disable: true } },
    'mid-invalid-show': { control: { disable: true } },
    'mid-invalid-hide': { control: { disable: true } },
    'input-container': { control: { disable: true } },
    event: { table: { disable: true } },
    clear: {
      table: { category: 'Methods' },
      type: 'function',
      description: 'Clears all input elements',
    },
    focus: {
      table: { category: 'Methods' },
      type: 'function',
      description: 'Focuses the first input element',
    },
  },
} satisfies Meta<CodeInputProps>;

export default meta;
type Story = StoryObj<CodeInputProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {
    labelAttr: 'Engangskode',
    descriptionAttr:
      'Vennligst tast inn engangskoden vi har tilsendt din mobil',
  },
  render: ({
    length,
    minlength,
    value,
    label,
    labelAttr,
    descriptionSlot,
    descriptionAttr,
    type,
    size,
    autofocus,
    disabled,
    hidelabel,
    hidedescription,
    inputmode,
    invalidmessage,
  }: CodeInputProps) => {
    return html`
      <mid-code-input
        value=${ifDefined(value)}
        label=${ifDefined(labelAttr)}
        description=${ifDefined(descriptionAttr)}
        length=${ifDefined(length)}
        minlength=${ifDefined(minlength)}
        type=${ifDefined(type)}
        size=${ifDefined(size)}
        inputmode=${ifDefined(inputmode)}
        invalidmessage=${ifDefined(invalidmessage)}
        ?hidelabel=${hidelabel}
        ?hidedescription=${hidedescription}
        ?autofocus=${autofocus}
        ?disabled=${disabled}
      >
        ${label ? html`<span slot="label">${label}</span>` : nothing}
        ${descriptionSlot
          ? html`<span slot="description">${descriptionSlot}</span>`
          : nothing}
      </mid-code-input>
    `;
  },
};

/**
 * Guards the invalid-event and focus contract that the OTC pages rely on:
 * programmatic `value` changes must not dispatch `mid-invalid-*` or reset
 * `forceError()` (a stray `mid-invalid-hide` erases the error the page is
 * showing), and `focus()` before first render must be queued, not dropped.
 */
export const ValidationEvents: Story = {
  args: {
    labelAttr: 'Engangskode',
    type: 'number',
    length: 5,
    minlength: 5,
  },
  render: ({ length, minlength, labelAttr, type }: CodeInputProps) => html`
    <form @submit=${(e: Event) => e.preventDefault()}>
      <mid-code-input
        name="otc"
        label=${ifDefined(labelAttr)}
        length=${ifDefined(length)}
        minlength=${ifDefined(minlength)}
        type=${ifDefined(type)}
      ></mid-code-input>
      <button type="button">Neste felt</button>
    </form>
  `,
  play: async ({ canvasElement, userEvent }) => {
    const el = canvasElement.querySelector('mid-code-input')!;
    const form = canvasElement.querySelector('form')!;
    const otherButton = canvasElement.querySelector('button')!;
    await el.updateComplete;

    const events: string[] = [];
    for (const name of ['mid-invalid-show', 'mid-invalid-hide']) {
      el.addEventListener(name, () => events.push(name));
    }

    // Typing: exactly one invalid event per keystroke (a second one per key
    // means setValue is running from the value watcher again).
    el.focus();
    await userEvent.keyboard('12345');
    await el.updateComplete;
    await expect(el.value).toBe('12345');
    await expect(new FormData(form).get('otc')).toBe('12345');
    await expect(events).toHaveLength(5);

    // A server error pinned with forceError() must survive the blur caused
    // by something else (e.g. a global alert) taking focus.
    el.invalidmessage = 'Ugyldig kode. Prøv igjen';
    el.forceError();
    await el.updateComplete;
    const beforeBlur = events.length;
    otherButton.focus();
    await el.updateComplete;
    await expect(events.slice(beforeBlur)).not.toContain('mid-invalid-hide');
    await expect(
      el.shadowRoot!.querySelector('.validation-message')!.textContent,
    ).toContain('Ugyldig kode');

    // Programmatic reset: FormData syncs silently, no invalid events.
    el.invalidmessage = '';
    const beforeReset = events.length;
    el.value = '';
    await el.updateComplete;
    await expect(events).toHaveLength(beforeReset);
    await expect(new FormData(form).get('otc')).toBe('');

    // focus() before first render is queued and lands after render.
    const late = document.createElement('mid-code-input');
    late.setAttribute('label', 'Sen montering');
    late.setAttribute('length', '5');
    canvasElement.appendChild(late);
    late.focus();
    await late.updateComplete;
    await expect(late.shadowRoot!.activeElement).not.toBeNull();
    late.remove();
  },
};
