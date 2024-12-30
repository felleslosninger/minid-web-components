import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/radio-group.component';
import '../components/radio-button.component';
import '../components/button.component';

type RadioButtonProps = {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
};

const meta: Meta<RadioButtonProps> = {
  title: 'Komponenter/Under arbeid/Radio Button',
  component: 'mid-radio-button',
  argTypes: {},
};

export default meta;

type Story = StoryObj<RadioButtonProps>;

export const Main: Story = {
  args: {
    label: 'Velg en av følgende',
    name: 'example',
    value: 'halibut',
  },
  decorators: [
    (story) =>
      html`<form
        class="flex flex-col gap-4"
        @formdata=${({ formData }: FormDataEvent) => {
          console.log(formData);
        }}
        @submit=${(event: SubmitEvent) => {
          event.preventDefault();
          const target = event.target as HTMLFormElement;
          const data = new FormData(target);
          document.querySelector('.output')!.textContent = JSON.stringify({
            vaue: data,
          });
          console.log(event, target.value, data);
          for (const pair of data.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
          }
        }}
      >
        ${story()}
        <div class="flex">
          <mid-button type="submit"> Submit </mid-button>
          <pre class="output"></pre>
        </div>
      </form> `,
  ],
  render: ({ label, value, checked, disabled }: RadioButtonProps) => html`
    <mid-radio-group value="halibut" label=${label}>
      <mid-radio-button value="seabass"> Havabbor </mid-radio-button>
      <mid-radio-button value="${value}"> Kveite </mid-radio-button>
      <mid-radio-button value="squirtle"> Squirtle </mid-radio-button>
      <mid-radio-button value="terminator">
        Terminator II (1991)
      </mid-radio-button>
    </mid-radio-group>
  `,
};
