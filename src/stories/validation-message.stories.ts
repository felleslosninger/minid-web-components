import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/validation-message.component';
import type { MinidValidationMessage } from '../components/validation-message.component';

type ValidationMessageProps = Partial<Pick<MinidValidationMessage, 'color'>> & {
  message: string;
  hidden: boolean;
};

const meta: Meta = {
  title: 'Typografi/Validation Message',
  component: 'mid-validation-message',
  argTypes: {
    color: {
      control: 'select',
      options: ['danger', 'success', 'warning', 'info'],
    },
    message: { type: 'string' },
    hidden: { type: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<ValidationMessageProps>;

export const Main: Story = {
  args: {
    color: 'danger',
    message: 'Det du prøver å gjøre er faktisk ikke lov',
    hidden: false,
  },
  render: ({ color, message, hidden }: ValidationMessageProps) => html`
    <mid-validation-message color=${color ?? 'danger'} ?hidden=${hidden}>
      ${message}
    </mid-validation-message>
  `,
};

export const AlleVarianter: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <mid-validation-message color="danger">Feil – dette er en feilmelding</mid-validation-message>
      <mid-validation-message color="success">Suksess – kravet er oppfylt</mid-validation-message>
      <mid-validation-message color="warning">Advarsel – vær oppmerksom</mid-validation-message>
      <mid-validation-message color="info">Informasjon – dette er nyttig å vite</mid-validation-message>
    </div>
  `,
};
