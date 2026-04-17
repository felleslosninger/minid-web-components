import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { DSBreadcrumbsElement } from "@digdir/designsystemet-web"


const meta: Meta = {
  title: 'Designsystemet/Breadcrumbs',
  component: 'ds-breadcrumbs',
};

export default meta;

type Story = StoryObj<DSBreadcrumbsElement>;

export const Main: Story = {
  render: () => {
    return html`
      <ds-breadcrumbs class="ds-breadcrumbs" aria-label="Du er her:">
        <a class="ds-link" href="#" aria-label="Tilbake til Nivå 3">Nivå 3</a>
        <ol>
          <li>
            <a class="ds-link" href="#">Nivå 1</a>
          </li>
          <li>
            <a class="ds-link" href="#">Nivå 2</a>
          </li>
          <li>
            <a class="ds-link" href="#">Nivå 3</a>
          </li>
          <li>
            <a class="ds-link" href="#">Nivå 4</a>
          </li>
        </ol>
      </ds-breadcrumbs>
    `;
  },
};

export const BackButton: Story = {
  render: () => {
    return html`
      <ds-breadcrumbs
        class="ds-breadcrumbs"
        aria-label="Brødsmulesti"
      >
        <a class="ds-link" href="#" aria-label="Tilbake til Nivå 3">Nivå 3</a>
      </ds-breadcrumbs>
    `;
  },
};
