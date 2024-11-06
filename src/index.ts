import './vendor.css';

export {
  registerIconLibrary,
  unregisterIconLibrary,
} from './components/icon/icon-library.ts';

import { CountdownComponent } from './components/countdown.component.ts';
export { CountdownComponent };

import { MinidAlert } from './components/alert.component.ts';
export { MinidAlert };

import { MinidButton } from './components/button.component.ts';
export { MinidButton };

import { MinidCheckbox } from './components/checkbox.component';
export { MinidCheckbox };

import { MinidDropdown } from './components/dropdown.component.ts';
export { MinidDropdown };

import { MinidHeading } from './components/heading.component.ts';
export { MinidHeading };

import { MinidHelptext } from 'src/components/helptext.component.ts';
export { MinidHelptext };

import { MinidIcon } from './components/icon/icon.component.ts';
export { MinidIcon };

import { MinidLabel } from './components/label.component.ts';
export { MinidLabel };

import { MinidMenuItem } from './components/menu-item.component.ts';
export { MinidMenuItem };

import { MinidMenu } from './components/menu.component.ts';
export { MinidMenu };

import { MinidParagraph } from './components/paragraph.component.ts';
export { MinidParagraph };

import { MinidPopup } from './components/popup.component.ts';
export { MinidPopup };

import { MinidSearch } from 'src/components/search.component.ts';
export { MinidSearch };

import { MinidSpinner } from './components/spinner.component';
export { MinidSpinner };

import { MinidTextfield } from './components/textfield.component.ts';
export { MinidTextfield };

import { MinidTooltip } from './components/tooltip.component.ts';
export { MinidTooltip };

declare global {
  interface HTMLElementTagNameMap {
    'countdown-component': CountdownComponent;
    'mid-alert': MinidAlert;
    'mid-button': MinidButton;
    'mid-checkbox': MinidCheckbox;
    'mid-dropdown': MinidDropdown;
    'mid-heading': MinidHeading;
    'mid-helptext': MinidHelptext;
    'mid-icon': MinidIcon;
    'mid-label': MinidLabel;
    'mid-menu-item': MinidMenuItem;
    'mid-menu': MinidMenu;
    'mid-paragraph': MinidParagraph;
    'mid-popup': MinidPopup;
    'mid-search': MinidSearch;
    'mid-spinner': MinidSpinner;
    'mid-textfield': MinidTextfield;
    'mid-tooltip': MinidTooltip;
  }
}
