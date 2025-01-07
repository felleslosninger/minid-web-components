import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/radio-group.component';
import '../components/radio.component';
import '../components/button.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MinidRadioGroup } from '../components/radio-group.component';

type RadioProps = {
  label?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  labelhidden?: boolean;
  size?: MinidRadioGroup['size'];
  'mid-change': Event;
  'mid-input': Event;
};

const meta: Meta<RadioProps> = {
  title: 'Komponenter/Under arbeid/Radio',
  component: 'mid-radio-group',
  subcomponents: { MidRadio: 'mid-radio' },
  argTypes: {
    name: { type: 'string' },
    value: { type: 'string' },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    'mid-change': { control: { disable: true } },
    'mid-input': { control: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<RadioProps>;

export const Main: Story = {
  args: {
    label: 'Velg en av følgende',
    name: 'berry',
    value: 'currant',
  },
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
  render: ({
    label,
    name,
    value,
    labelhidden,
    size,
    disabled,
  }: RadioProps) => html`
    <mid-radio-group
      name="${ifDefined(name)}"
      value=${ifDefined(value)}
      label=${ifDefined(label)}
      size=${ifDefined(size)}
      ?disabled=${disabled}
      ?labelhidden=${labelhidden}
    >
      <mid-radio value="gooseberry"> Stikkelsbær </mid-radio>
      <mid-radio value="currant"> Rips </mid-radio>
      <mid-radio disabled value="rock"> Rockemusikk </mid-radio>
      <mid-radio value="kielland"> Alexander Kielland </mid-radio>
    </mid-radio-group>
  `,
};
