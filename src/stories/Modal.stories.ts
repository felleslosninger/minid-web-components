import type { Meta, StoryObj } from '@storybook/web-components';
import { html, Part } from 'lit';
import '../components/button.component';
import '../components/modal.component';
import '../components/paragraph.component';

type ModalProps = {
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
  footerSlot?: string;
  heading?: string;
  '--'?: string;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Modal',
  component: 'mid-modal',
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
      description: 'Shows the modal.',
    },
    hide: {
      control: false,
      table: { category: 'Methods' },
      type: 'function',
      description: 'Hides the modal',
    },
  },
  parameters: {
    controls: {
      exclude: ['dialog', 'panel', 'handleDialogCancel'],
    },
  },
} satisfies Meta<ModalProps>;

export default meta;
type Story = StoryObj<ModalProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {},
  render: ({
    open,
    footerSlot,
    heading,
    'mid-request-close': requestClose,
    '--': defaultSlot,
  }: ModalProps) => {
    return html`
      <mid-button class="modal-button">Modal</mid-button>
      <mid-modal
        ?open=${open}
        class="modal"
        @mid-request-close=${(event) =>
          requestClose === 'preventDefault' && event.preventDefault()}
      >
        <span slot="heading"> ${heading ?? 'Bekreft handling'} </span>
        <mid-paragraph
          >${defaultSlot ??
          'Er du sikker på at du vil utføre denne handlingen? Det er ikke sikkert at handlingen kan reverseres.'}
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
      </mid-modal>
      <script>
        var modalButton = document.querySelector('.modal-button');
        var cancelButton = document.querySelector('.cancel-button');
        var confirmButton = document.querySelector('.confirm-button');
        var modal = document.querySelector('.modal');

        modalButton.addEventListener('click', () => modal.show());
        cancelButton.addEventListener('click', () => modal.hide());
        confirmButton.addEventListener('click', () => modal.hide());
      </script>
    `;
  },
};
