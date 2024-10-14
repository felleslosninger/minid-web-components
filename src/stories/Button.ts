import { html } from 'lit';
import '../components/button.component';
import { ifDefined } from 'lit/directives/if-defined.js';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  type: 'button' | 'submit' | 'reset';
  label: string;
  href?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}
export const Button = ({
  variant,
  size,
  label,
  type,
  href,
  fullWidth,
  disabled,
}: ButtonProps) => {
  return html`<mid-button
    @click=${onclick}
    type="${type}"
    size=${ifDefined(size)}
    variant=${ifDefined(variant)}
    href=${ifDefined(href)}
    ?fullwidth=${fullWidth}
    ?disabled=${disabled}
    >${label}
  </mid-button>`;
};
