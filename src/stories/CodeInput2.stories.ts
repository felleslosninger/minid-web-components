import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/code-input-2.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type CodeInputProps = Partial<{
  length: number;
}>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Under arbeid/Code Input 2',
  component: 'mid-code-input-2',
  argTypes: {},
} satisfies Meta<CodeInputProps>;

export default meta;
type Story = StoryObj<CodeInputProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {},
  render: ({ length }: CodeInputProps) => {
    return html`<mid-code-input-2
        class="text-body-xl"
        length="${ifDefined(length)}"
      ></mid-code-input-2>

      <script>
        var codeInput = document.querySelector('mid-code-input-2');
        codeInput.addEventListener('mid-code-change', () => {
          console.log(codeInput.value);
        });
        codeInput.addEventListener('mid-code-complete', () => {
          console.log(codeInput.value);
        });
      </script> `;
  },
};
