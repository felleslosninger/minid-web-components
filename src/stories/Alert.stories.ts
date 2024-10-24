import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/alert.component';
import '../components/heading.component';
import '../components/paragraph.component';
import type { MinidAlert } from '../components/alert.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type AlertProps = {
  title: string;
  content: string;
  elevated: boolean;
  severity?: MinidAlert['severity'];
  iconlabel?: string;
  size?: MinidAlert['size'];
};

const meta = {
  title: 'Komponenter/Alert',
  component: 'mid-alert',
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    severity: {
      control: {
        type: 'radio',
      },
      options: ['warning', 'info', 'danger', 'success'],
    },
    iconlabel: {
      control: { type: 'text' },
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
  render: ({
    content,
    severity,
    title,
    elevated,
    iconlabel,
    size,
  }: AlertProps) => html`
    <mid-alert
      ?elevated=${elevated}
      size=${ifDefined(size)}
      iconlabel=${ifDefined(iconlabel)}
      severity=${ifDefined(severity)}
    >
      <mid-heading spacing level="2" size="xs"> ${title} </mid-heading>
      <mid-paragraph>${content}</mid-paragraph>
    </mid-alert>
  `,
};
