import type { Meta, StoryObj } from '@storybook/web-components';
import { html, Part } from 'lit';
import '../components/alert.component';
import '../components/heading.component';
import '../components/paragraph.component';
import '../components/button.component';
import { MinidAlert } from '../components/alert.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type AlertProps = {
  title: string;
  content: string;
  elevated: boolean;
  closable?: boolean;
  open?: boolean;
  severity?: MinidAlert['severity'];
  iconlabel?: string;
  duration?: number;
  size?: MinidAlert['size'];
  base: Part;
  '--': string;
  'mid-show': Event;
  'mid-hide': Event;
  'mid-after-show': Event;
  'mid-after-hide': Event;
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
    duration: { type: 'number' },
    base: { control: { disable: true } },
    'mid-after-hide': { control: { disable: true } },
    'mid-after-show': { control: { disable: true } },
    'mid-hide': { control: { disable: true } },
    'mid-show': { control: { disable: true } },
    '--': { name: '-' },
  },
  parameters: {
    controls: {
      exclude: [
        'autoHideTimeout',
        'remainingTimeInterval',
        'countdownElement',
        'remainingTime',
      ],
    },
  },
} satisfies Meta<AlertProps>;

export default meta;
type Story = StoryObj<AlertProps>;

export const Main: Story = {
  args: {
    title: 'Advarsel: Viktig melding!',
    content: 'Dette er en viktig melding som krever umiddelbar oppmerksomhet.',
    open: true,
  },
  render: ({
    content,
    severity,
    title,
    elevated,
    iconlabel,
    size,
    duration,
    closable,
    open,
    ...rest
  }: AlertProps) => html`
    <mid-alert
      ?open=${open}
      ?elevated=${elevated}
      ?closable=${closable}
      size=${ifDefined(size)}
      iconlabel=${ifDefined(iconlabel)}
      severity=${ifDefined(severity)}
      duration=${ifDefined(duration)}
    >
      ${rest['--']
        ? html`<span>${rest['--']}</span>`
        : html`<mid-heading spacing level="2" size="xs"> ${title} </mid-heading>
            <mid-paragraph>${content}</mid-paragraph>`}
    </mid-alert>
  `,
};

export const Toast: Story = {
  args: {
    title: 'Advarsel: Viktig melding!',
    content: 'Dette er en viktig melding som krever umiddelbar oppmerksomhet.',
    duration: 3000,
  },
  decorators: [
    (story) => html` <div class="flex flex-col gap-2">${story()}</div>`,
  ],
  render: ({
    content,
    severity,
    title,
    elevated,
    iconlabel,
    size,
    duration,
  }: AlertProps) => html`
    <mid-alert
      class="toast-alert"
      ?elevated=${elevated}
      size=${ifDefined(size)}
      iconlabel=${ifDefined(iconlabel)}
      severity=${ifDefined(severity)}
      duration=${ifDefined(duration)}
    >
      <mid-heading spacing level="2" size="xs"> ${title} </mid-heading>
      <mid-paragraph>${content}</mid-paragraph>
    </mid-alert>
    <mid-button class="toast-button">Toast</mid-button>
    <script>
      const alert = document.querySelector('.toast-alert');
      const button = document.querySelector('.toast-button');
      button.addEventListener('click', () => alert.toast());
    </script>
  `,
};

export const ToastFactory: Story = {
  args: {
    title: 'Advarsel: Viktig melding!',
    content: 'Dette er en viktig melding som krever umiddelbar oppmerksomhet.',
    duration: 30000,
  },
  decorators: [
    (story) => html` <div class="flex flex-col gap-2">${story()}</div>`,
  ],
  render: () => html`
    <mid-button class="toast-factory-button">Toast</mid-button>
    <script>
      const createAlertButton = document.querySelector('.toast-factory-button');
      let count = 0;

      function escapeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
      }

      function notify(message, duration = 3000) {
        const alert = Object.assign(document.createElement('mid-alert'), {
          closable: true,
          duration: duration,
          innerHTML: escapeHtml(message),
        });
        document.body.append(alert);
        return alert.toast();
      }

      createAlertButton.addEventListener('click', () => {
        notify('Her er viktig melding #' + ++count);
      });
    </script>
  `,
};
