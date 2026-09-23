import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
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

  @state()
  private showFallbackContent = false;

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

  /**
   * Label for the button that reveals the QR content as text or link.
   */
  @property({ attribute: 'fallback-button-label' })
  fallbackButtonLabel = "Can't scan the QR code?";

  private get isUrlContent() {
    try {
      const url = new URL(this.content);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  }

  private handleToggleFallbackContent() {
    this.showFallbackContent = !this.showFallbackContent;
  }

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

      <mid-button
        type="button"
        variant="tertiary"
        @click=${this.handleToggleFallbackContent}
        aria-expanded=${this.showFallbackContent}
        aria-controls="qr-content-fallback"
      >
        ${this.fallbackButtonLabel}
      </mid-button>

      <div
        id="qr-content-fallback"
        class="mt-2"
        ?hidden=${!this.showFallbackContent}
      >
        ${
          this.isUrlContent
            ? html`<mid-link
                href=${ifDefined(this.content || undefined)}
                target="_blank"
                rel="noopener noreferrer"
              >
                ${this.content}
              </mid-link>`
            : html`<p class="text-body-sm text-default break-all">${this.content}</p>`
        }
      </div>
    `;
  }
}
