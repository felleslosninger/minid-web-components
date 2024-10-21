import { customElement, property, state } from 'lit/decorators.js';
import { css, html, HTMLTemplateResult, LitElement } from 'lit';
// import type { MidIconName } from '../../types/icon-name.ts';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';
import { styled } from 'src/mixins/tailwind.mixin';
import { watch } from 'src/internal/watch.ts';
import {
  getIconLibrary,
  unwatchIcon,
  watchIcon,
} from 'src/components/icon/icon-library.ts';
import { isTemplateResult } from 'lit/directive-helpers.js';

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

@customElement('mid-icon')
export class MinidIcon extends styled(LitElement, styles) {
  #initialRender = false;

  /** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */
  private async resolveIcon(url: string): Promise<SVGResult> {
    let fileData: Response;
    console.log('resolve', url);
    try {
      fileData = await fetch(url, { mode: 'cors' });
      if (!fileData.ok)
        return fileData.status === 410 ? CACHEABLE_ERROR : RETRYABLE_ERROR;
    } catch {
      return RETRYABLE_ERROR;
    }

    try {
      const div = document.createElement('div');
      div.innerHTML = await fileData.text();

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

  @state() private svg: SVGElement | HTMLTemplateResult | null = null;

  /** The name of the icon to draw. Available names depend on the icon library being used. */
  @property({ reflect: true }) name?: string;

  /**
   * An external URL of an SVG file. Be sure you trust the content you are including, as it will be executed as code and
   * can result in XSS attacks.
   */
  @property() src?: string;

  /**
   * An alternate description to use for assistive devices. If omitted, the icon will be considered presentational and
   * ignored by assistive devices.
   */
  @property() label = '';

  /** The name of a registered custom icon library.
   *  @default nav-aksel
   *
   */
  @property({ reflect: true }) library = 'nav-aksel';

  /**
   * Accepts a css property like `100px` or `40rem` or number of pixels like `68`
   */
  @property({ type: String })
  size?: string;

  @property({ type: String })
  fill?: string;

  @property({ type: String })
  stroke?: string;

  connectedCallback() {
    super.connectedCallback();
    this._whenSettled();
    watchIcon(this);
  }

  firstUpdated() {
    this.#initialRender = true;
    this.setIcon();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    unwatchIcon(this);
  }

  /**
   * @ignore
   */
  #placeholderRef: Ref<HTMLElement> = createRef();

  async _whenSettled() {
    await this.updateComplete;
    if (this.size != null) {
      this.#placeholderRef.value?.style.setProperty('width', this.size);
      this.#placeholderRef.value?.style.setProperty('height', this.size);
    }
  }

  #createSvgFromString(svgString: string): SVGElement {
    const div = document.createElement('div');
    div.innerHTML = svgString;

    return (
      div.querySelector('svg') ??
      document.createElementNS('http://www.w3.org/2000/svg', 'path')
    );
  }

  #placeholder() {
    return html` <div ${ref(this.#placeholderRef)}></div> `;
  }

  private getIconSource(): IconSource {
    const library = getIconLibrary(this.library);
    console.log('get icon source', this.name, library, this.src);

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

  @watch(['name', 'src', 'library'])
  async setIcon() {
    const { url, fromLibrary } = this.getIconSource();
    console.log('setting icon', url, fromLibrary, this.library);
    const library = fromLibrary ? getIconLibrary(this.library) : undefined;

    if (!url) {
      this.svg = null;
      return;
    }

    let iconResolver = iconCache.get(url);
    console.log(iconResolver);

    if (!iconResolver) {
      iconResolver = this.resolveIcon(url);
      iconCache.set(url, iconResolver);
    }

    // If we haven't rendered yet, exit early. This avoids unnecessary work due to watching multiple props.
    if (!this.#initialRender) {
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
        // this.emit('mid-error');
        break;
      default:
        this.svg = svg.cloneNode(true) as SVGElement;
        library?.mutator?.(this.svg);
      // this.emit('mid-load');
    }
  }

  protected render() {
    // const importedIcon = import(
    //   `../../../src/assets/icons/${this.name}.svg?raw`
    // )
    //   .catch((error) => {
    //     console.error(
    //       `👻 Caught an error while importing an icon named '${this.name}', did you remember to add it to assets? `
    //     );
    //     throw error;
    //   })
    //   .then((iconModule) => {
    //     const svgElement = this.#createSvgFromString(iconModule.default);
    //     svgElement.role = 'img';

    //     if (this.size) {
    //       svgElement.setAttribute('width', `${this.size}`);
    //       svgElement.setAttribute('height', `${this.size}`);
    //     }

    //     if (this.fill) {
    //       svgElement.setAttribute('fill', this.fill);
    //       svgElement.childNodes.forEach((node) => {
    //         if (node instanceof SVGElement) {
    //           node.removeAttribute('fill');
    //         }
    //       });
    //     }

    //     if (this.stroke) {
    //       svgElement.setAttribute('stroke', this.stroke);
    //       svgElement.childNodes.forEach((node) => {
    //         if (node instanceof SVGElement) {
    //           node.removeAttribute('stroke');
    //         }
    //       });
    //     }

    //     return html`${svgElement}`;
    //   });

    // return until(importedIcon, this.#placeholder());
    return this.svg;
  }
}
