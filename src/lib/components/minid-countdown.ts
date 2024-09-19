import { customElement, property, state } from 'lit/decorators.js';

import { css, html, LitElement } from 'lit';
import { tailwind } from 'src/lib/mixins/tailwind.mixin';

@customElement('minid-countdown')
export class MinidCountDown extends tailwind(LitElement) {
  static override styles = [
    css`
      :host {
        display: inline-block;
        margin: auto;
      }
    `,
  ];

  @property({ type: Number })
  expiry!: number; // future timestamp in ms

  @property({ type: String })
  size: string = '150';

  @state()
  showSpinner = false;

  @property({ attribute: false })
  callback?: () => void;

  dingUrl = new URL('../../static/audio/ding-126626.mp3', import.meta.url);

  firstUpdated() {
    const canvas = <HTMLCanvasElement>this.shadowRoot!.querySelector('canvas');

    canvas.width = parseInt(this.size);
    canvas.height = parseInt(this.size);

    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.height / 2 - 1;
    const duration = this.expiry - Date.now(); // total countdown time
    let prevTimeRemaining = duration;

    const drawCountdown = () => {
      const timeRemaining = this.expiry - Date.now();

      if (prevTimeRemaining - timeRemaining < 50) {
        // Skip drawing if time difference is less than 50ms
        requestAnimationFrame(drawCountdown); // otherwise this will update 60 times per second...
        return;
      }

      prevTimeRemaining = timeRemaining;

      if (timeRemaining > 0) {
        const elapsedTime = duration - timeRemaining;

        const arcLength = 2 * Math.PI * (elapsedTime / duration);
        const startAngle = arcLength - Math.PI / 2;

        const secondsRemaining = Math.max(Math.ceil(timeRemaining / 1000), 0); // Ensure non-negative
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // draw arc
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, -Math.PI / 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'grey';
        ctx.fillStyle = '#edf3f9';
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // draw text
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'grey';
        const textOffset = centerY / 3;
        ctx.fillText(formattedTime, centerX, centerY + textOffset);

        requestAnimationFrame(drawCountdown);
      } else {
        this.showSpinner = true;
        const audio = new Audio(this.dingUrl.href);
        audio.volume = 0.5;
        audio.play();
        this.dispatchEvent(
          new CustomEvent('countdown-expired', {
            bubbles: true,
            composed: true,
          })
        );
      }
    };

    drawCountdown();
  }

  override render() {
    return this.showSpinner
      ? html`<div class="flex items-center justify-center">
          <minid-spinner width="150px"></minid-spinner>
        </div>`
      : html`<canvas></canvas>`;
  }
}
