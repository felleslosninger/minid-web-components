import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import 'src/lib/components/dropdown.component';
export interface DropdownProps {}

export const Dropdown = (props: DropdownProps) => {
  return html`<mid-dropdown>
    <ul class="fds-dropdownmenu fds-dropdownmenu--md">
      <li>Litt om meg</li>
      <li>Interessante ting</li>
      <li>Kjøp</li>
    </ul>
  </mid-dropdown>`;
};
