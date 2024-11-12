import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/button.component';
import '../components/modal.component';

type ModalProps = {
  open: boolean;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Modal',
  component: 'mid-modal',
  argTypes: {},
} satisfies Meta<ModalProps>;

export default meta;
type Story = StoryObj<ModalProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {},
  render: ({ open }: ModalProps) => {
    return html`
      <mid-button class="button">Modal</mid-button>
      <mid-modal ?open=${open} class="modal"></mid-modal>
      <script>
        const modalButton = document.querySelector('.button');
        const modal = document.querySelector('.modal');

        modalButton.addEventListener('click', () => {
          modal.open ? modal.hide() : modal.show();
        });
      </script>
    `;
  },
};
