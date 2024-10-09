import { html } from 'lit';
import '../components/icon.component';
import { MidIconName } from 'src/types/icon-name';

export interface IconProps {
  name: MidIconName;
  size: string;
  fill: string;
  stroke: string;
}

export const Icon = ({ name, size, fill, stroke }: IconProps) => {
  return html`<mid-icon
    fill=${fill}
    stroke=${stroke}
    size=${size}
    name=${name}
  ></mid-icon>`;
};
