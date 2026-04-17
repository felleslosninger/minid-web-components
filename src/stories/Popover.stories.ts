import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';


const meta: Meta = {
  title: 'Designsystemet/Popover',
};

export default meta;


export const Main: StoryObj = {
  render: () => {
    return html`
      <button
        class="ds-button"
        data-variant="primary"
        type="button"
        popoverTarget="target"
      >Åpne popover</button>
      <div
        class="ds-popover"
        id="target"
        popover="manual"
        data-placement="top"
        data-variant="default"
      >
        Popoveret gir en rask beskjed. Her kan du vise brukeren informasjon
        som er relevant for konteksten.
      </div>
    `;
  },
};

export const Inline: StoryObj = {
  render: () => {
    return html`
      <p class="ds-paragraph" data-variant="default">
        Vi bruker 
        <button data-popover="inline" popoverTarget="inline-trigger">design tokens</button>
        for å sikre at vi har en konsistent design.
      </p>
      <div
        class="ds-popover"
        id="inline-trigger"
        popover="manual"
        data-placement="top"
        data-variant="default"
        data-color="neutral"
      >
        <p class="ds-paragraph" data-variant="default">
          <strong style="display:block">Design tokens</strong>
          Design tokens er en samling av variabler som definerer designet i et
          designsystem.
        </p>
      </div>
    `;
  },
};
