import { customElement, property, state } from 'lit/decorators.js';
import { css, HTMLTemplateResult, LitElement } from 'lit';
import { styled } from 'src/mixins/tailwind.mixin';
import { watch } from 'src/internal/watch.ts';
import {
  getIconLibrary,
  unwatchIcon,
  watchIcon,
} from 'src/components/icon/icon-library.ts';
import { isTemplateResult } from 'lit/directive-helpers.js';
import { MidIconName } from '../../types/icon-name';

const styles = [
  css`
    :host {
      display: inline-flex;
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

interface IconSource {
  url?: string;
  fromLibrary: boolean;
}

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
  library = 'nav-aksel';

  /**
   * @ignore
   */
  #hasRendered = false;

  /**
   * Given a URL, this function returns the resulting SVG element or an appropriate error symbol.
   */
  private async resolveIcon(url: string): Promise<SVGResult> {

    let svgString = '';

    if(url.startsWith("data:image/svg+xml")) {
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

  connectedCallback() {
    super.connectedCallback();
    watchIcon(this);
  }

  firstUpdated() {
    this.#hasRendered = true;
    this.setIcon();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    unwatchIcon(this);
  }

  private getIconSource(): IconSource {
    const library = getIconLibrary(this.library);
    if (this.name && library) {
      return {
        url: library.resolver(this.name),
        fromLibrary: true,
      };
    }

    return {
      url: this.src,
      fromLibrary: false,
    };
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
    const { url, fromLibrary } = this.getIconSource();
    const library = fromLibrary ? getIconLibrary(this.library) : undefined;

    if (!url) {
      this.svg = null;
      return;
    }

    let iconResolver = iconCache.get(url);

    if (!iconResolver) {
      iconResolver = this.resolveIcon(url);
      iconCache.set(url, iconResolver);
    }

    // If we haven't rendered yet, exit early. This avoids unnecessary work due to watching multiple props.
    if (!this.#hasRendered) {
      return;
    }

    const svg = await iconResolver;

    if (svg === RETRYABLE_ERROR) {
      iconCache.delete(url);
    }

    if (url !== this.getIconSource().url) {
      // If the url has changed while fetching the icon, ignore this request
      return;
    }

    if(!svg.width || !svg.heigth || svg.width !== "1em" || svg.height !== "1em") {
      svg.setAttribute('width', '1em');
      svg.setAttribute('height', '1em');
    }

    if (isTemplateResult(svg)) {
      this.svg = svg;

      if (library) {
        // Using a templateResult requires the SVG to be written to the DOM first before we can grab the SVGElement
        // to be passed to the library's mutator function.
        await this.updateComplete;

        const shadowSVG = this.shadowRoot!.querySelector("[part='svg']")!;

        if (typeof library.mutator === 'function' && shadowSVG) {
          library.mutator(shadowSVG as SVGElement);
        }
      }

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
        library?.mutator?.(this.svg);
        this.dispatchEvent(
          new Event('mid-load', { bubbles: true, composed: true })
        );
    }
  }

  protected render() {
    return this.svg;
  }
}
