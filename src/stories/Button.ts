import { html } from 'lit';

import '../../src/lib/components/minid-countdown';
import '../lib/components/button';
import { ifDefined } from 'lit/directives/if-defined.js';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  label: string;
  encapsulated: boolean;
  onClick?: () => void;
}
export const Button = ({
  onClick,
  variant,
  size,
  label,
  encapsulated,
}: ButtonProps) => {
  return encapsulated
    ? html`<mwc-button variant=${ifDefined(variant)}>${label}</mwc-button>`
    : html`
        <button
          type="button"
          class="${[
            'btn',
            `${size ? 'btn-' + size : ''}`,
            `${variant ? 'btn-' + variant : ''}`,
          ].join(' ')}"
          @click=${onClick}
        >
          ${label}
        </button>
      `;
};
