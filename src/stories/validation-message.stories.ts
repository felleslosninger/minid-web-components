import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/validation-message.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type validationMessageProps = Partial<{
  hidden: boolean;
  message: string;
}>;

const meta: Meta = {
  title: 'Typografi/Validation Message',
  component: 'mid-validation-message',
  argTypes: {
    message: { type: 'string' },
    hidden: { type: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<validationMessageProps>;

export const Main: Story = {
  args: {
    message: 'Det du prøver å gjøre er faktisk ikke lov',
    hidden: false,
  },
  render: ({ message, hidden }: validationMessageProps) => {
    return html`
      <mid-validation-message ?hidden=${hidden}>
        ${message}
      </mid-validation-message>
    `;
  },
};
