import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styled } from 'src/mixins/tailwind.mixin';
import './textfield.component';
import './icon/icon.component';
import './button.component';
import { live } from 'lit/directives/live.js';
import { MinidTextfield } from './textfield.component.ts';

@customElement('mid-search')
export class MinidSearch extends styled(LitElement) {
  @query('mid-textfield')
  textField!: MinidTextfield;

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  @property()
  label = '';

  @property()
  placeholder = '';

  @property()
  value = '';

  private handleInput() {
    this.value = this.textField.value;
  }

  override render() {
    return html`
      <mid-textfield
        .value=${live(this.value)}
        type="search"
        size=${this.size}
        label=${this.label}
        placeholder=${this.placeholder}
        @input=${this.handleInput}
        clearable
      >
        <mid-icon
          slot="prefix"
          class="text-2xl"
          library="system"
          name="magnifying-glass"
        >
        </mid-icon>
      </mid-textfield>
    `;
  }
}
