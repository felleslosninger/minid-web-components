import { html } from 'lit';
import '../lib/components/button.component';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  type: 'button' | 'submit' | 'reset';
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
  type,
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
