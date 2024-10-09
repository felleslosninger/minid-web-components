import { html } from 'lit';
import '../components/button.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  type: 'button' | 'submit' | 'reset';
  label: string;
  encapsulated: boolean;
  onClick?: () => void;
  href?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}
export const Button = ({
  onClick,
  variant,
  size,
  label,
  encapsulated,
  type,
  href,
  fullWidth,
  disabled,
}: ButtonProps) => {
  const classes = {
    'btn-primary': variant === 'primary',
    'btn-secondary': variant === 'secondary',
    'btn-tertiary': variant === 'tertiary',
    'btn-lg': size === 'lg',
    'btn-sm': size === 'sm',
  };
  return encapsulated
    ? html`<mid-button
        type="${type}"
        size=${ifDefined(size)}
        variant=${ifDefined(variant)}
        href=${ifDefined(href)}
        ?fullwidth=${fullWidth}
        ?disabled=${disabled}
        >${label}
      </mid-button>`
    : html`
        <button
          type="${type}"
          class="btn ${classMap(classes)}"
          @click=${onClick}
        >
          ${label}
        </button>
      `;
};
