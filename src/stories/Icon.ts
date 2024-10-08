import { html } from 'lit';
import '../../lib/components/icon.component';

export interface IconProps {
  name: string;
}

export const Icon = ({ name }: IconProps) => {
  return html`<mid-icon name=${name}></mid-icon>`;
};
