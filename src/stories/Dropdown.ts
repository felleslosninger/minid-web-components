import { html } from 'lit';
import 'src/lib/components/dropdown.component';
export interface DropdownProps {}

export const Dropdown = (props: DropdownProps) => {
  return html`<mid-dropdown>
    <mid-button @click=${() => (this.open = !this.open)} slot="anchor"
      >hei hei
    </mid-button>
    <ul class="fds-dropdownmenu fds-dropdownmenu--md">
      <li>Litt om meg</li>
      <li>Interessante ting</li>
      <li>Kjøp</li>
    </ul>
  </mid-dropdown>`;
};
