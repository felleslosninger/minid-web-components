import { html } from 'lit';

import '../../lib/components/minid-countdown';

export interface CountdownProps {
  expiry: number;
}
export const Countdown = ({ expiry }: CountdownProps) => {
  return html`<minid-countdown
    expiry=${Date.now() + expiry}
  ></minid-countdown> `;
};
