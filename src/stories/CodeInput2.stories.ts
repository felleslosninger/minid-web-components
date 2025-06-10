import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../components/code-input-2.component';
import { ifDefined } from 'lit/directives/if-defined.js';

type CodeInputProps = Partial<{
  length: number;
  value: string;
  label: string;
  autofocus: boolean;
  disabled: boolean;
  readonly: boolean;
  hidelabel: boolean;
}>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Komponenter/Under arbeid/Code Input 2',
  component: 'mid-code-input-2',
  argTypes: {
    value: { type: 'string' },
  },
} satisfies Meta<CodeInputProps>;

export default meta;
type Story = StoryObj<CodeInputProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Main: Story = {
  args: {
    autofocus: true,
    label: 'Engangskode',
  },
  render: ({
    length,
    value,
    label,
    autofocus,
    disabled,
    hidelabel,
    readonly,
  }: CodeInputProps) => {
    return html`
      <mid-code-input-2
        id="code-input"
        value="${ifDefined(value)}"
        label="${ifDefined(label)}"
        length="${ifDefined(length)}"
        ?hidelabel=${hidelabel}
        ?readonly=${readonly}
        ?autofocus=${autofocus}
        ?disabled=${disabled}
      ></mid-code-input-2>

      <script>
        var codeInput = document.querySelector('mid-code-input-2');
        codeInput.addEventListener('mid-change', () => {
          console.log(codeInput.value);
        });
        codeInput.addEventListener('mid-complete', () => {
          console.log(codeInput.value);
        });
      </script>
    `;
  },
};
