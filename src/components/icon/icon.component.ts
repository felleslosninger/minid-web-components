import { customElement, property, state } from 'lit/decorators.js';
import { css, HTMLTemplateResult, LitElement } from 'lit';
import { styled } from '../../mixins/tailwind.mixin';
import { watch } from '../../internal/watch.ts';
import { isTemplateResult } from 'lit/directive-helpers.js';
import { MidIconName } from '../../types/icon-name';
import { systemIcons } from './system.icon-library.ts';

const styles = [
  css`
    :host {
      display: inline-flex;
      width: 1em;
      height: 1em;
      box-sizing: content-box !important;
    }

    svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  `,
];

const CACHEABLE_ERROR = Symbol();
const RETRYABLE_ERROR = Symbol();
type SVGResult =
  | HTMLTemplateResult
  | SVGSVGElement
  | typeof RETRYABLE_ERROR
  | typeof CACHEABLE_ERROR;

let parser: DOMParser;
const iconCache = new Map<string, Promise<SVGResult>>();

/**
 *
 * Size and color can be adjusted with `font-size` and `color` css properties
 *
 * @event mid-load - Emitted when the icon has loaded
 * @event mid-error - Emitted when the icon fails to load
 */
@customElement('mid-icon')
export class MinidIcon extends styled(LitElement, styles) {
  /**
   * @ignore
   */
  @state()
  private svg: SVGElement | HTMLTemplateResult | null = null;

  /**
   * The name of the icon to draw. Available names depend on the icon library being used.
   * Preview default icons [here](https://aksel.nav.no/ikoner)
   * @type string
   */
  @property({ reflect: true })
  name?: MidIconName | (string & {}); // weird typing makes sure we have both intellisense and ability to input any string

  /**
   * An external URL of an SVG file. Be sure you trust the content you are including, as it will be executed as code and
   * can result in XSS attacks.
   */
  @property()
  src?: string;

  /**
   * An alternate description to use for assistive devices. If omitted, the icon will be considered presentational and
   * ignored by assistive devices.
   */
  @property()
  alt?: string;

  /**
   * The name of a registered custom icon library.
   *  @default nav-aksel
   */
  @property({ reflect: true })
  library: 'system' | 'country' | 'nav-aksel' = 'nav-aksel';

  /**
   * @ignore
   */
  #hasRendered = false;

  /**
   * Given a URL, this function returns the resulting SVG element or an appropriate error symbol.
   */
  private async resolveIcon(url: string): Promise<SVGResult> {
    let svgString = '';

    if (url.startsWith('data:image/svg+xml')) {
      svgString = decodeURIComponent(url);
    } else {
      let fileData: Response;
      try {
        fileData = await fetch(url, { mode: 'cors' });

        if (!fileData.ok) {
          return fileData.status === 410 ? CACHEABLE_ERROR : RETRYABLE_ERROR;
        }
      } catch {
        return RETRYABLE_ERROR;
      }
      svgString = await fileData.text();
    }

    try {
      const div = document.createElement('div');
      div.innerHTML = svgString;

      const svg = div.firstElementChild;
      if (svg?.tagName?.toLowerCase() !== 'svg') {
        return CACHEABLE_ERROR;
      }

      if (!parser) {
        parser = new DOMParser();
      }
      const doc = parser.parseFromString(svg.outerHTML, 'text/html');

      const svgEl = doc.body.querySelector('svg');
      if (!svgEl) {
        return CACHEABLE_ERROR;
      }

      svgEl.part.add('svg');

      return document.adoptNode(svgEl);
    } catch {
      return CACHEABLE_ERROR;
    }
  }

  firstUpdated() {
    this.#hasRendered = true;
    this.setIcon();
  }

  @watch('alt')
  handleLabelChange() {
    if (typeof this.alt === 'string' && this.alt.length > 0) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.alt);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  @watch(['name', 'src', 'library'])
  async setIcon() {
    if (!this.library && !this.name && !this.src) {
      this.svg = null;
      return;
    }

    let iconResolver = iconCache.get(`${this.library}-${this.name}`);
    const iconKey = `${this.library}-${this.name}`;

    if (!iconResolver) {
      let svgUrl: string;

      if (this.src) {
        iconResolver = this.resolveIcon(this.src);
        iconCache.set(iconKey, iconResolver);
      } else if (this.library === 'nav-aksel') {
        svgUrl = await import(`../../assets/icons/${this.name}.svg`).then(
          (result) => result.default
        );
        iconResolver = this.resolveIcon(svgUrl);
        iconCache.set(iconKey, iconResolver);
      } else if (this.library === 'country') {
        svgUrl = await import(`../../assets/flags/${this.name}.svg`).then(
          (result) => result.default
        );
        iconResolver = this.resolveIcon(svgUrl);
        iconCache.set(iconKey, iconResolver);
      } else if (this.library === 'system') {
        svgUrl = `data:image/svg+xml,${encodeURIComponent(systemIcons[this.name as keyof typeof systemIcons])}`;
        iconResolver = this.resolveIcon(svgUrl);
        iconCache.set(iconKey, iconResolver);
      }
    }

    // If we haven't rendered yet, exit early. This avoids unnecessary work due to watching multiple props.
    if (!this.#hasRendered) {
      return;
    }

    const svg = await iconResolver;

    if (!svg) {
      return;
    }

    if (svg === RETRYABLE_ERROR) {
      iconCache.delete(iconKey);
    }

    if (iconKey !== `${this.library}-${this.name}`) {
      // If the url has changed while fetching the icon, ignore this request
      return;
    }

    if (isTemplateResult(svg)) {
      this.svg = svg;

      return;
    }

    switch (svg) {
      case RETRYABLE_ERROR:
      case CACHEABLE_ERROR:
        this.svg = null;
        this.dispatchEvent(
          new Event('mid-error', { bubbles: true, composed: true })
        );
        break;
      default:
        this.svg = svg.cloneNode(true) as SVGElement;
        this.dispatchEvent(
          new Event('mid-load', { bubbles: true, composed: true })
        );
    }
  }

  protected render() {
    return this.svg;
  }
}
