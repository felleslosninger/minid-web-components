import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, Part } from 'lit';
import '../components/radio-group.component';
import '../components/radio.component';
import '../components/button.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MinidRadioGroup } from '../components/radio-group.component';
import { classMap } from 'lit/directives/class-map.js';

export type RadioProps = Partial<{
  label: string;
  name: string;
  value: string;
  checked: boolean;
  disabled: boolean;
  invalidmessage: string;
  required: boolean;
  labelhidden: boolean;
  size: 'sm' | 'md' | 'lg';
  '--': string;
  'mid-change': Event;
  'mid-input': Event;
  base: Part;
  'form-control': Part;
  'form-control-label': Part;
}>;

const meta: Meta<RadioProps> = {
  title: 'Komponenter/Radio',
  tags: ['alpha'],
  component: 'mid-radio-group',
  subcomponents: { MidRadio: 'mid-radio' },
  argTypes: {
    name: { type: 'string' },
    value: { type: 'string' },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Adjust the size by setting the font size on the group.',
    },
    '--': { name: '-', control: { disable: true } },
    'mid-change': { control: { disable: true } },
    'mid-input': { control: { disable: true } },
    base: { control: { disable: true } },
    'form-control-label': { control: { disable: true } },
    'form-control': { control: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<RadioProps>;

export const Main: Story = {
  args: {
    label: 'Hei, hva med å velge en ting?',
    name: 'berry',
  },
  render: ({
    label,
    name,
    value,
    labelhidden,
    size,
    disabled,
    invalidmessage,
    required,
  }: RadioProps) => html`
    <mid-radio-group
      class=${classMap({
        'text-body-sm': size === 'sm',
        'text-body-md': size === 'md',
        'text-body-lg': size === 'lg',
      })}
      name="${ifDefined(name)}"
      value=${ifDefined(value)}
      label=${ifDefined(label)}
      invalidmessage=${ifDefined(invalidmessage)}
      size=${ifDefined(size)}
      ?disabled=${disabled}
      ?required=${required}
      ?labelhidden=${labelhidden}
    >
      <mid-radio value="gooseberry"> Stikkelsbær </mid-radio>
      <mid-radio value="currant"> Rips </mid-radio>
      <mid-radio disabled value="rock"> Rockemusikk </mid-radio>
      <mid-radio value="kielland"> Alexander Kielland</mid-radio>
    </mid-radio-group>
  `,
  decorators: [
    (story) =>
      html`<form
        class="flex flex-col gap-4"
        @reset=${() => {
          document.querySelector('.output')!.textContent = '';
        }}
        @submit=${(event: SubmitEvent) => {
          event.preventDefault();

          const target = event.target as HTMLFormElement;
          const valid = target.reportValidity();
          const formData = new FormData(target);
          const data = Object.fromEntries(formData);

          console.log(valid, data);
          document.querySelector('.output')!.textContent = JSON.stringify({
            ...data,
          });
          console.log(event, target.value, data);
        }}
      >
        ${story()}
        <div class="flex flex-row-reverse items-end justify-end gap-4">
          <pre class="output"></pre>
          <mid-button type="submit"> Submit </mid-button>
          <mid-button variant="secondary" type="reset"> Reset </mid-button>
        </div>
      </form> `,
  ],
};
