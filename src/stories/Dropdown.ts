import { html } from 'lit';
import '../components/button.component';
import '../components/dropdown.component';
import '../components/menu.component';
import '../components/menu-item.component';
import { MinidDropdown } from '../components/dropdown.component';
import { ifDefined } from 'lit/directives/if-defined.js';

export interface DropdownProps {
  open?: boolean;
  size?: 'sm' | 'md' | 'lg';
  placement?: MinidDropdown['placement'];
  distance?: number;
  skidding?: number;
  hoist: boolean;
}

export const Dropdown = ({
  open,
  distance,
  hoist,
  placement,
  size,
  skidding,
}: DropdownProps) => {
  return html`<mid-dropdown
    ?open=${open}
    ?hoist=${hoist}
    distance=${ifDefined(distance)}
    placement=${ifDefined(placement)}
    size=${ifDefined(size)}
    skidding=${ifDefined(skidding)}
  >
    <mid-button slot="trigger"> Nedtrekk </mid-button>
    <mid-menu>
      <mid-menu-item href="https://www.google.com"> google.com </mid-menu-item>
      <mid-menu-item @click=${click1}> Interessante ting </mid-menu-item>
      <mid-menu-item @click=${click2}> Logg ut </mid-menu-item>
    </mid-menu>
  </mid-dropdown>`;
};

export const click1 = () => {
  console.log('click 1');
};

export const click2 = () => {
  console.log('click 2');
};
