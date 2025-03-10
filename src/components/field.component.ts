import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styled } from '../mixins/tailwind.mixin';
import dsStyles from '@digdir/designsystemet-css/field.css?inline';

const styles = [dsStyles];

@customElement('mid-field')
export class MinidField extends styled(LitElement, styles) {
  @property()
  position?: string;

  override render() {
    return html`
      <div class="ds-field" data-position=${ifDefined(this.position)}>
        <slot></slot>
      </div>
    `;
  }
}
