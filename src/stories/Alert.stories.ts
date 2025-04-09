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
  'data-color'?: MinidAlert['severity'];
  'data-size'?: MinidAlert['size'];
  duration?: number;
  base: Part;
  '--': string;
  'mid-show': Event;
  'mid-hide': Event;
  'mid-after-show': Event;
  'mid-after-hide': Event;
  show: Function;
  hide: Function;
  toast: Function;
};

const meta = {
  title: 'Komponenter/Alert',
  component: 'mid-alert',
  argTypes: {
    'data-size': {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    'data-color': {
      type: 'string',
      control: {
        type: 'radio',
      },
      options: ['warning', 'info', 'danger', 'success'],
    },
    duration: { type: 'number' },
    base: { control: false },
    'mid-after-hide': { control: false },
    'mid-after-show': { control: false },
    'mid-hide': { control: false },
    'mid-show': { control: false },
    '--': { name: '-' },
    show: {
      control: false,
      table: { category: 'Methods' },
      type: 'function',
      description: 'Shows the alert.',
    },
    hide: {
      control: false,
      table: { category: 'Methods' },
      type: 'function',
      description: 'Hides the alert',
    },
    toast: {
      control: false,
      table: { category: 'Methods' },
      type: 'function',
      description:
        'Displays the alert as a toast notification. This will move the alert out of its position in the DOM and, when dismissed, it will be removed from the DOM completely. By storing a reference to the alert, you can reuse it by calling this method again. The returned promise will resolve after the alert is hidden.',
    },
  },
  parameters: {
    controls: {
      exclude: [
        'severity',
        'size',
        'autoHideTimeout',
        'remainingTimeInterval',
        'countdownElement',
        'remainingTime',
        'notificationContent',
      ],
    },
  },
} satisfies Meta<AlertProps>;

export default meta;
type Story = StoryObj<AlertProps>;

export const Main: Story = {
  args: {
    title: 'Viktig informasjon!',
    content: 'Dette er en viktig melding som krever umiddelbar oppmerksomhet.',
    open: true,
  },
  render: ({
    content,
    'data-color': dataColor,
    title,
    elevated,
    'data-size': size,
    duration,
    closable,
    open,
    '--': defaultSlot,
  }: AlertProps) => html`
    <mid-alert
      ?open=${open}
      ?elevated=${elevated}
      ?closable=${closable}
      duration=${ifDefined(duration)}
      data-color=${ifDefined(dataColor)}
      data-size=${ifDefined(size)}
    >
      ${defaultSlot
        ? html`<span>${defaultSlot}</span>`
        : html`<mid-heading spacing="2" level="2" size="xs">
              ${title}
            </mid-heading>
            <p>${content}</p>`}
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
    'data-color': severity,
    title,
    elevated,
    'data-size': size,
    duration,
  }: AlertProps) => html`
    <mid-alert
      class="toast-alert"
      ?elevated=${elevated}
      duration=${ifDefined(duration)}
      data-size=${ifDefined(size)}
      data-color=${ifDefined(severity)}
    >
      <mid-heading spacing="2" level="2" size="xs"> ${title} </mid-heading>
      <mid-paragraph>${content}</mid-paragraph>
    </mid-alert>
    <mid-button class="toast-button">Toast</mid-button>
    <script>
      var alert = document.querySelector('.toast-alert');
      var button = document.querySelector('.toast-button');
      button.addEventListener('click', () => alert.toast());
    </script>
  `,
};

export const ToastFactory: Story = {
  decorators: [
    (story) => html` <div class="flex flex-col gap-2">${story()}</div>`,
  ],
  render: () => html`
    <mid-button class="toast-factory-button">Toast</mid-button>
    <script>
      var factoryButton = document.querySelector('.toast-factory-button');
      var count = 0;

      function notify(message, duration = 3000) {
        const alert = document.createElement('mid-alert');
        document.body.append(alert);
        return alert.toast({ message }, duration);
      }

      factoryButton.addEventListener('click', () => {
        notify('Her er viktig melding #' + ++count);
      });
    </script>
  `,
};
