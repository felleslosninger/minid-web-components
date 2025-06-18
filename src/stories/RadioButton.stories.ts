import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/radio-group.component';
import '../components/radio-button.component';
import '../components/button.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { RadioProps } from './Radio.stories';

const meta: Meta<RadioProps> = {
  title: 'Komponenter/Radio Button',
  tags: ['experimental'],
  component: 'mid-radio-group',
  subcomponents: { MidRadioButton: 'mid-radio-button' },
  argTypes: {
    name: { type: 'string' },
    value: { type: 'string' },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
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
    label: 'Velg en av følgende',
    name: 'choice',
    value: 'halibut',
    labelhidden: true,
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
      ?labelhidden=${labelhidden}
      ?disabled=${disabled}
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
