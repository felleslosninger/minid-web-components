import { html } from 'lit';
import 'src/lib/components/button.component';
import 'src/lib/components/dropdown.component';
import 'src/lib/components/menu.component';
import 'src/lib/components/menu-item.component';

export interface DropdownProps {
  open: boolean;
  size: 'sm' | 'md' | 'lg';
}

export const Dropdown = ({ open }: DropdownProps) => {
  return html`<mid-dropdown .open=${open}>
    <mid-button
      @click=${() => {
        open = !open;
      }}
      slot="trigger"
      >Nedtrekk
    </mid-button>
    <mid-menu>
      <mid-menu-item href="https://www.google.com">Lit om meg</mid-menu-item>

      <mid-menu-item> Interessante ting </mid-menu-item>
      <mid-menu-item variant="tertiary">Logg ut</mid-menu-item>
    </mid-menu>
  </mid-dropdown>`;
};
