import './vendor.css';

import { SpinnerComponent } from 'src/components/spinner.component';
export { SpinnerComponent };

import { MinidCheckbox } from 'components/checkbox.component';
export { MinidCheckbox };

import { MinidButton } from 'components/button.component.ts';
export { MinidButton };

import { CountdownComponent } from 'components/countdown.component.ts';
export { CountdownComponent };

import { MinidDropdown } from 'components/dropdown.component.ts';
export { MinidDropdown };

import { MinidIcon } from 'components/icon.component.ts';
export { MinidIcon };

import { MinidMenu } from 'components/menu.component.ts';
export { MinidMenu };

import { MinidMenuItem } from 'components/menu-item.component.ts';
export { MinidMenuItem };

import { MinidPopup } from 'components/popup.component.ts';
export { MinidPopup };

import { MinidTextfield } from 'components/textfield.component.ts';
export { MinidTextfield };

import { MinidParagraph } from 'components/paragraph.component.ts';
export { MinidParagraph };

import { MinidLabel } from 'components/label.component.ts';
export { MinidLabel };

import { MinidHeading } from 'components/heading.component.ts';
export { MinidHeading };

declare global {
  interface HTMLElementTagNameMap {
    'mid-icon': MinidIcon;
    'mid-button': MinidButton;
  }
}
