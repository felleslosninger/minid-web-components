import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing, Part } from 'lit';
import '../components/alert.component';
import '../components/heading.component';
import '../components/paragraph.component';
import '../components/button.component';
import { MinidAlert } from '../components/alert.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { expect, fn, waitFor, within } from 'storybook/test';

type AlertProps = Partial<{
  title: string;
  content: string;
  elevated: boolean;
  closable: boolean;
  open: boolean;
  severity: MinidAlert['severity'];
  iconlabel: string;
  duration: number;
  size: MinidAlert['size'];
  base: Part;
  '--': string;
  'mid-show': Event;
  'mid-hide': Event;
  'mid-after-show': Event;
  'mid-after-hide': Event;
  show: Function;
  hide: Function;
  toast: Function;
}>;

const meta = {
  title: 'Komponenter/Alert',
  component: 'mid-alert',
  argTypes: {
    title: {
      type: 'string',
    },
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
  args: {
    show: fn((alert: MinidAlert) => {
      alert.show();
    }),
    toast: fn((alert: MinidAlert, message = 'melding', duration = 3000) => {
      return alert.toast({ message }, duration);
    }),
    hide: fn((alert: MinidAlert) => {
      alert.hide();
    }),
  },
} satisfies Meta<AlertProps>;

export default meta;
type Story = StoryObj<AlertProps>;

export const Main: Story = {
  args: {
    content: 'Dette er en viktig melding .',
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
    '--': defaultSlot,
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
      ${!title
        ? nothing
        : html` <mid-heading level="2" size="xs"> ${title} </mid-heading>`}
      ${defaultSlot
        ? html`${defaultSlot}`
        : html`<mid-paragraph>${content}</mid-paragraph>`}
    </mid-alert>
  `,
  play: async ({ canvasElement, userEvent, args }) => {
    const alert = canvasElement.querySelector('mid-alert');
    await expect(alert).toBeTruthy();

    args.show!(alert!);
    await waitFor(() => expect(alert?.open).toBe(true));
    args.hide!(alert!);
    await waitFor(() => expect(alert?.open).toBe(false));
  },
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
  parameters: {
    docs: {
      source: {
        language: 'ts',
        code: `
          const alert = document.querySelector('mid-alert');
          const button = document.querySelector('mid-button');
          button.addEventListener('click', () => alert.toast());
        `,
      },
    },
  },
  render: (
    {
      content,
      severity,
      title,
      elevated,
      iconlabel,
      size,
      duration,
      toast,
    }: AlertProps,
    { canvasElement }
  ) => html`
    <mid-alert
      ?elevated=${elevated}
      size=${ifDefined(size)}
      iconlabel=${ifDefined(iconlabel)}
      severity=${ifDefined(severity)}
      duration=${ifDefined(duration)}
    >
      <mid-heading spacing level="2" size="xs"> ${title} </mid-heading>
      <mid-paragraph>${content}</mid-paragraph>
    </mid-alert>
    <mid-button
      class="toast-button"
      @click=${() => {
        const alert = canvasElement.querySelector('mid-alert');
        if (toast && alert) {
          toast(alert);
        }
      }}
    >
      Toast
    </mid-button>
  `,
  play: async ({ canvasElement, userEvent, args }) => {
    const alert = canvasElement.querySelector('mid-alert');
    const button = canvasElement.querySelector('mid-button');

    await expect(alert).toBeTruthy();
    await expect(button).toBeTruthy();
    await userEvent.click(button!);
    await expect(args.toast).toHaveBeenCalledOnce();
  },
};

let count = 0;

export const ToastFactory: Story = {
  args: {
    toast: fn((message = 'melding', duration = 3000) => {
      const alert = document.createElement('mid-alert');
      document.body.append(alert);
      return alert.toast({ message }, duration);
    }),
  },
  decorators: [
    (story) => html` <div class="flex flex-col gap-2">${story()}</div>`,
  ],
  parameters: {
    docs: {
      source: {
        language: 'typescript',
        code: `
          let count = 0;
          const factoryButton = document.querySelector('.toast-factory-button');

          function notify(message: string, duration = 3000) {
            const alert = document.createElement('mid-alert');
            document.body.append(alert);
            return alert.toast({ message }, duration);
          }

          factoryButton.addEventListener('click', () => {
            notify('Her er viktig melding #' + ++count);
          });
        `,
      },
    },
  },
  render: ({ toast }) => html`
    <mid-button @click=${() => toast!('Her er viktig melding #' + ++count)}>
      Toast
    </mid-button>
  `,
  play: async ({ canvasElement, userEvent, args }) => {
    const button = canvasElement.querySelector('mid-button');
    await expect(button).toBeTruthy();

    let toastStack = document.querySelector('.mid-toast-stack');

    // Clear existing toasts before starting the test
    toastStack?.childNodes.forEach((node) => toastStack?.removeChild(node));

    const length = 3;
    for (let i = 0; i < length; i++) {
      await userEvent.click(button!);
    }

    toastStack ??= document.querySelector('.mid-toast-stack');
    await expect(args.toast).toHaveBeenCalledTimes(length);
    await expect(toastStack).toBeTruthy();
    await waitFor(() => expect(toastStack?.childNodes).toHaveLength(length));
  },
};
