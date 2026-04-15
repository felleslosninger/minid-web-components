import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

type TabsProps = Partial<{
  hidden: boolean;
  message: string;
}>;

const meta: Meta = {
  title: 'Designsystemet/Tabs',
  component: 'ds-tabs',
};

export default meta;

type Story = StoryObj<TabsProps>;

export const Main: Story = {
  render: () => {
    return html`
      <ds-tabs class="ds-tabs">
        <ds-tablist>
          <ds-tab aria-controls="value1">Tab 1</ds-tab>
          <ds-tab aria-controls="value2">Tab 2</ds-tab>
          <ds-tab aria-controls="value3">Tab 3</ds-tab>
        </ds-tablist>
        <ds-tabpanel id="value1">content 1</ds-tabpanel>
        <ds-tabpanel id="value2">content 2</ds-tabpanel>
        <ds-tabpanel id="value3">content 3</ds-tabpanel>
      </ds-tabs>
    `;
  },
};
