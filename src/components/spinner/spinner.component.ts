import { customElement, property } from 'lit/decorators.js';

import { html } from 'lit';
import { MinidElement } from 'mixins/tailwind.mixin';

@customElement('mid-spinner')
export class SpinnerComponent extends MinidElement {

    spinner = new URL("./CircleBroken_black.svg", import.meta.url);

    @property({type: String})
    width = '150px';

    override render() {
        return html`
            <img src="${this.spinner}" alt="spinner" class="flex animate-spin font-bold" width="${this.width}"/>
        `;
    }
}