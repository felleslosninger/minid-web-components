import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/button.component';
import '../components/modal.component';
import '../components/paragraph.component';

type ModalProps = {
  open: boolean;
  preventClose: boolean;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Modal',
  component: 'mid-modal',
  argTypes: {
    preventClose: { type: 'boolean' },
  },
  parameters: {
    controls: {
      exclude: ['dialogElement'],
    },
  },
} satisfies Meta<ModalProps>;

export default meta;
type Story = StoryObj<ModalProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {
    preventClose: false,
  },
  render: ({ open, preventClose }: ModalProps) => {
    return html`
      <mid-button class="modal-button">Modal</mid-button>
      <mid-modal
        ?open=${open}
        class="modal"
        @mid-request-close=${(event) => preventClose && event.preventDefault()}
      >
        <span slot="heading"> Bekreft handling </span>
        <mid-paragraph>
          Er du sikker på at du vil utføre denne handlingen? Det er ikke sikkert
          at handlingen kan reverseres.
        </mid-paragraph>
        <div
          slot="footer"
          class="flex flex-row-reverse gap-4 self-stretch justify-self-end"
        >
          <mid-button class="confirm-button">Bekreft</mid-button>
          <mid-button class="cancel-button" variant="secondary"
            >Avbryt
          </mid-button>
        </div>
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
