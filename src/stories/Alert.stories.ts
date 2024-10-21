import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/alert.component';
import '../components/heading.component';
import type { MinidAlert } from '../components/alert.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type AlertProps = {
  title: string;
  content: string;
  severity?: MinidAlert['severity'];
};

const meta = {
  title: 'Komponenter/Alert',
  component: 'mid-alert',
  argTypes: {
    severity: {
      control: {
        type: 'radio',
      },
      options: ['warning', 'info', 'danger', 'success'],
    },
  },
} satisfies Meta<AlertProps>;

export default meta;
type Story = StoryObj<AlertProps>;

export const Main: Story = {
  args: {
    title: 'Advarsel: Viktig melding!',
    content: 'Dette er en viktig melding som krever umiddelbar oppmerksomhet.',
  },
  render: ({ content, severity, title }: AlertProps) => html`
    <mid-alert severity=${ifDefined(severity)}>
      <mid-heading spacing level="2" size="xs"> ${title} </mid-heading>
      ${content}
    </mid-alert>
  `,
};
