import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/radio-group.component';
import '../components/radio-button.component';
import '../components/button.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MinidRadioGroup } from '../components/radio-group.component';

type RadioButtonProps = {
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

const meta: Meta<RadioButtonProps> = {
  title: 'Komponenter/Under arbeid/Radio Button',
  component: 'mid-radio-group',
  subcomponents: { MidRadioButton: 'mid-radio-button' },
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

type Story = StoryObj<RadioButtonProps>;

export const Main: Story = {
  args: {
    label: 'Velg en av følgende',
    name: 'choice',
    // value: 'halibut',
    labelhidden: true,
  },
  decorators: [
    (story) =>
      html`<form
        class="flex flex-col gap-4"
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
        <div class="flex items-end gap-4">
          <mid-button type="submit"> Submit </mid-button>
          <pre class="output"></pre>
        </div>
      </form> `,
  ],
  render: ({ label, name, value, labelhidden }: RadioButtonProps) => html`
    <mid-radio-group
      name="${ifDefined(name)}"
      value=${ifDefined(value)}
      label=${ifDefined(label)}
      ?labelhidden=${labelhidden}
    >
      <mid-radio-button value="seabass"> Havabbor </mid-radio-button>
      <mid-radio-button value="halibut"> Kveite </mid-radio-button>
      <mid-radio-button value="squirtle"> Squirtle </mid-radio-button>
      <mid-radio-button value="terminator">
        Terminator II (1991)
      </mid-radio-button>
    </mid-radio-group>
  `,
};
