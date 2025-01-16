import './styles/global.css';

export {
  registerIconLibrary,
  unregisterIconLibrary,
} from './components/icon/icon-library.ts';
export { countryLabelsNO } from './components/utilities/countries.ts';

export { dsTailwindPreset } from './styles/tailwind.preset.ts';

import { CountdownComponent } from './components/countdown.component.ts';
export { CountdownComponent };

import { MinidAlert } from './components/alert.component.ts';
export { MinidAlert };

import { MinidButton } from './components/button.component.ts';
export { MinidButton };

import { MinidCheckbox } from './components/checkbox.component.ts';
export { MinidCheckbox };

import { MinidCodeInput } from './components/code-input.component.ts';
export { MinidCodeInput };

import { MinidCombobox } from './components/combobox.component.ts';
export { MinidCombobox };

import { MinidDropdown } from './components/dropdown.component.ts';
export { MinidDropdown };

import { MinidHeading } from './components/heading.component.ts';
export { MinidHeading };

import { MinidHelptext } from './components/helptext.component.ts';
export { MinidHelptext };

import { MinidIcon } from './components/icon/icon.component.ts';
export { MinidIcon };

import { MinidLabel } from './components/label.component.ts';
export { MinidLabel };

import { MinidLink } from './components/link.component.ts';
export { MinidLink };

import { MinidMenuItem } from './components/menu-item.component.ts';
export { MinidMenuItem };

import { MinidMenu } from './components/menu.component.ts';
export { MinidMenu };

import { MinidModal } from './components/modal.component.ts';
export { MinidModal };

import { MinidParagraph } from './components/paragraph.component.ts';
export { MinidParagraph };

import { MinidPhoneInput } from './components/phone-input.component.ts';
export { MinidPhoneInput };

import { MinidPopup } from './components/popup.component.ts';
export { MinidPopup };

import { MinidQrCode } from './components/qr-code.componet.ts';
export { MinidQrCode };

import { MinidSearch } from './components/search.component.ts';
export { MinidSearch };

import { MinidSpinner } from './components/spinner.component.ts';
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
    'mid-code-input': MinidCodeInput;
    'mid-combobox': MinidCombobox;
    'mid-dropdown': MinidDropdown;
    'mid-heading': MinidHeading;
    'mid-helptext': MinidHelptext;
    'mid-icon': MinidIcon;
    'mid-label': MinidLabel;
    'mid-link': MinidLink;
    'mid-menu-item': MinidMenuItem;
    'mid-menu': MinidMenu;
    'mid-modal': MinidModal;
    'mid-paragraph': MinidParagraph;
    'mid-phone-input': MinidPhoneInput;
    'mid-popup': MinidPopup;
    'mid-qr-code': MinidQrCode;
    'mid-search': MinidSearch;
    'mid-spinner': MinidSpinner;
    'mid-textfield': MinidTextfield;
    'mid-tooltip': MinidTooltip;
  }
}
