import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin';
import QRCode from 'qrcode';

declare global {
  interface HTMLElementTagNameMap {
    'mid-qr-code': MinidQrCode;
  }
}

@customElement('mid-qr-code')
export class MinidQrCode extends styled(LitElement) {
  @query('#qr-code')
  private canvas!: HTMLCanvasElement;

  /**
   * Text to encode
   */
  @property()
  content = '';

  /**
   * The label for assistive devices to announce. If unspecified, the content will be used instead.
   */
  @property()
  label = '';

  /**
   * Scale factor. A value of 1 means 1px per modules (black dots).
   */
  @property({ type: Number })
  scale = 4;

  /**
   * Forces a specific width for the output image.
   * If width is too small to contain the qr symbol, this option will be ignored.
   * Takes precedence over scale.
   */
  @property({ type: Number })
  width?: number;

  /**
   * The color of the QR pattern. Needs to be in hex format
   */
  @property()
  fill = '#000';

  /**
   * The color of the background. Needs to be in hex format
   */
  @property()
  background = '#fff';

  @property({ type: Number })
  margin = 4;

  protected updated() {
    QRCode.toCanvas(this.canvas, this.content, {
      scale: this.scale,
      color: { dark: this.fill, light: this.background },
      margin: this.margin,
      width: this.width,
    });
  }

  override render() {
    return html`
      <canvas
        aria-label="${this.label.length ? this.label : this.content}"
        role="img"
        id="qr-code"
      ></canvas>
    `;
  }
}
