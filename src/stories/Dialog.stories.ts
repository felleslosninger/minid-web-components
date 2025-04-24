import type { Meta, StoryObj } from '@storybook/web-components';
import { html, Part } from 'lit';
import '../components/button.component';
import '../components/dialog.component';
import '../components/paragraph.component';

type DialogProps = Partial<{
  open: boolean;
  'mid-show': Event;
  'mid-hide': Event;
  'mid-after-show': Event;
  'mid-after-hide': Event;
  'mid-request-close': 'preventDefault' | 'normal';
  base: Part;
  header: Part;
  footer: Part;
  body: Part;
  show: Function;
  hide: Function;
  footerSlot: string;
  heading: string;
  '--': string;
}>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Dialog',
  component: 'mid-dialog',
  argTypes: {
    'mid-request-close': {
      control: { type: 'select' },
      options: ['preventDefault', 'normal'],
    },
    'mid-after-hide': { control: false },
    'mid-after-show': { control: false },
    'mid-hide': { control: false },
    'mid-show': { control: false },
    base: { control: false },
    footer: { control: false },
    body: { control: false },
    header: { control: false },

    '--': { name: '-' },
    footerSlot: {
      name: 'footer',
      control: { type: 'text' },
      table: { category: 'slots' },
      description: 'The content inside the `footer` element',
    },
    show: {
      control: false,
      table: { category: 'Methods' },
      type: 'function',
      description: 'Shows the dialog.',
    },
    hide: {
      control: false,
      table: { category: 'Methods' },
      type: 'function',
      description: 'Hides the dialog',
    },
  },
  parameters: {
    controls: {
      exclude: ['dialog', 'panel', 'handleDialogCancel'],
    },
  },
} satisfies Meta<DialogProps>;

export default meta;
type Story = StoryObj<DialogProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {},
  render: ({
    open,
    footerSlot,
    heading,
    'mid-request-close': requestClose,
    '--': defaultSlot,
  }: DialogProps) => {
    return html`
      <mid-button class="dialog-button">Dialog</mid-button>
      <mid-dialog
        ?open=${open}
        class="dialog"
        @mid-request-close=${(event: Event) =>
          requestClose === 'preventDefault' && event.preventDefault()}
      >
        <h2 class="mb-2" slot="heading">${heading ?? 'Bekreft handling'}</h2>
        <mid-paragraph spacing
          >${defaultSlot ??
          'Er du sikker på at du vil utføre handling? Denne handlingen kan ikke reverseres. '}
        </mid-paragraph>
        ${footerSlot
          ? html`<div slot="footer">${footerSlot}</div>`
          : html`
              <div
                slot="footer"
                class="flex flex-row-reverse gap-4 self-stretch justify-self-end"
              >
                <mid-button class="confirm-button">Bekreft</mid-button>
                <mid-button class="cancel-button" variant="secondary"
                  >Avbryt
                </mid-button>
              </div>
            `}
      </mid-dialog>
      <script>
        var dialogButton = document.querySelector('.dialog-button');
        var cancelButton = document.querySelector('.cancel-button');
        var confirmButton = document.querySelector('.confirm-button');
        var dialog = document.querySelector('.dialog');

        dialogButton.addEventListener('click', () => dialog.show());
        cancelButton.addEventListener('click', () => dialog.hide());
        confirmButton.addEventListener('click', () => dialog.hide());
      </script>
    `;
  },
};
