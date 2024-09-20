import { html } from 'lit';

import '../../src/lib/components/minid-countdown';
import '../lib/components/button';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

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
  const classes = {
    'btn-primary': variant === 'primary',
    'btn-secondary': variant === 'secondary',
    'btn-tertiary': variant === 'tertiary',
    'btn-lg': size === 'large',
    'btn-sm': size === 'small',
  };
  return encapsulated
    ? html`<mwc-button type="submit" variant=${ifDefined(variant)}
        >${label}</mwc-button
      >`
    : html`
        <button
          type="button"
          class="fds-btn fds-btn--primary"
          @click=${onClick}
        >
          ${label}
        </button>
      `;
};
