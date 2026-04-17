import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import {DSSuggestionElement} from "@digdir/designsystemet-web"


const meta: Meta = {
  title: 'Designsystemet/Suggestion',
  component: 'ds-suggestion',
};

export default meta;

type Story = StoryObj<DSSuggestionElement>;

export const Main: Story = {
  render: () => {
    return html`
      <ds-field class="ds-field">
        <label class="ds-label" data-weight="medium">Velg en destinasjon</label>
        <ds-suggestion class="ds-suggestion">
          <input class="ds-input" type="text" placeholder=""/>
          <del aria-label="Tøm" hidden=""></del>
          <u-datalist
            data-nofilter=""
            data-sr-plural="%d forslag"
            data-sr-singular="%d forslag"
            popover="manual"
            role="listbox"
          >
            <u-option label="Sogndal" value="Sogndal">
              Sogndal
              <div>Kommune</div>
            </u-option>
            <u-option label="Oslo" value="Oslo">
              Oslo
              <div>Kommune</div>
            </u-option>
            <u-option label="Brønnøysund" value="Brønnøysund">
              Brønnøysund
              <div>Kommune</div>
            </u-option>
            <u-option label="Stavanger" value="Stavanger">
              Stavanger
              <div>Kommune</div>
            </u-option>
            <u-option label="Trondheim" value="Trondheim">
              Trondheim
              <div>Kommune</div>
            </u-option>
            <u-option label="Bergen" value="Bergen">
              Bergen
              <div>Kommune</div>
            </u-option>
            <u-option label="Lillestrøm" value="Lillestrøm">
              Lillestrøm
              <div>Kommune</div>
            </u-option>
          </u-datalist>
        </ds-suggestion>
      </ds-field>
    `;
  },
};

export const Multiple: Story = {
  render: () => {
    return html`
      <ds-field class="ds-field">
        <label class="ds-label" data-weight="medium">Velg en destinasjon</label>
        <ds-suggestion data-multiple="" class="ds-suggestion">
          <input class="ds-input" type="text" placeholder=""/>
          <del aria-label="Tøm" hidden=""></del>
          <u-datalist
            data-nofilter=""
            data-sr-plural="%d forslag"
            data-sr-singular="%d forslag"
            popover="manual"
            role="listbox"
          >
            <u-option>Sogndal</u-option>
            <u-option>Oslo</u-option>
            <u-option>Brønnøysund</u-option>
            <u-option>Stavanger</u-option>
            <u-option>Trondheim</u-option>
            <u-option>Bergen</u-option>
            <u-option>Lillestrøm</u-option>
          </u-datalist>
        </ds-suggestion>
      </ds-field>
    `;
  },
};
