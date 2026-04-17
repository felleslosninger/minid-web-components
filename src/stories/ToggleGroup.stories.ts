import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';


const meta: Meta = {
  title: 'Designsystemet/ToggleGroup',
};

export default meta;


export const Main: StoryObj = {
  render: () => {
    return html`
      <fieldset
        class="ds-toggle-group"
        data-toggle-group="Filter"
        data-variant="primary"
      >
        <label class="ds-button" data-variant="tertiary">
          <input
            type="radio"
            name="togglegroup"
            checked=""
            value="innboks"
          />
          Innboks
        </label>
        <label class="ds-button" data-variant="tertiary">
          <input
            type="radio"
            name="togglegroup"
            value="utkast"
          />
          Utkast
        </label>
        <label class="ds-button" data-variant="tertiary">
          <input
            type="radio"
            name="togglegroup"
            value="arkiv"
          />
          Arkiv
        </label>
        <label class="ds-button" data-variant="tertiary">
          <input
            type="radio"
            name="togglegroup"
            value="sendt"
          />
          Sendt
        </label>
      </fieldset>
    `;
  },
};
