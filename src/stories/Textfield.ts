import { html } from 'lit';
import '../components/textfield.component';
import { ifDefined } from 'lit/directives/if-defined.js';

export interface TextfieldProps {
  label?: string;
  value?: string;
  placeholder?: string;
  type?: 'text';
  size?: 'sm' | 'md' | 'lg';
}

export const Textfield = ({
  label,
  placeholder,
  size,
  type,
  value,
}: TextfieldProps) => {
  return html`<mid-textfield
    label="${ifDefined(label)}"
    value=${ifDefined(value)}
    placeholder=${ifDefined(placeholder)}
    type=${ifDefined(type)}
    size=${ifDefined(size)}
  ></mid-textfield>`;
};
