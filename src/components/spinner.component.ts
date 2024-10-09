import { customElement, property } from 'lit/decorators.js';

import { html, LitElement } from 'lit';
import { tailwind } from 'mixins/tailwind.mixin';

@customElement('mid-spinner')
export class SpinnerComponent extends tailwind(LitElement) {

    spinner = new URL("../assets/images/CircleBroken_black.svg", import.meta.url);

    @property({type: String})
    width = '150px';

    override render() {
        return html`
            <img src="${this.spinner}" alt="spinner" class="flex animate-spin font-bold" width="${this.width}"/>
        `;
    }
}