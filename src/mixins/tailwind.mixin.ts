import { CSSResultArray, LitElement } from 'lit';
// import tailwindStyles from '../styles/component-tailwind.css?inline';
import { Constructor } from '../types/mixin-constructor';

let tailwindSheet = new CSSStyleSheet();

export const setStyleSheet = (sheet: string) => {
  console.log(sheet);
  tailwindSheet.replaceSync(sheet);
};

export const styled = <T extends Constructor<LitElement>>(
  superClass: T,
  elementCss: CSSResultArray = []
): T =>
  class Styled extends superClass {
    /**
     * @ignore
     */
    static styles = [elementCss];

    // settailwindPath(sheet: CSSStyleSheet) {
    //   tailwindSheet = sheet;
    // }

    // static tailwindSelector =
    //   '[data-vite-dev-id="/Users/godstemning/Projects/minid-web-components/src/styles/component-tailwind.css"]';

    connectedCallback(): void {
      super.connectedCallback();
      if (this.shadowRoot) {
        this.shadowRoot.adoptedStyleSheets.push(tailwindSheet);
      }
    }
    // connectedCallback(): void {
    // super.connectedCallback();
    // const styleElement = document.querySelector(tailwindSelector) as any;

    // const stylesheet = new CSSStyleSheet();
    // stylesheet.replaceSync(styleElement.sheet);

    //   console.log('connected callback', tailwindSheet);

    //   if (this.shadowRoot && tailwindSheet) {
    //     this.shadowRoot.adoptedStyleSheets.push(tailwindSheet);
    //   }
    // }

    // static loadSheet(sheet: CSSStyleSheet) {
    //   Styled.prototype.loadAndAdoptStyleSheet(sheet);
    // }

    // async loadAndAdoptStyleSheet(sheet: CSSStyleSheet) {
    //   try {
    //     // const response = await import(path);
    //     // if (!response.ok) {
    //     //   throw new Error(`Failed to fetch CSS: ${response.status}`);
    //     // }

    //     // console.log(response);

    //     // const cssText = await response.default;

    //     // console.log(cssText, sheet);

    //     // const styleSheet = new CSSStyleSheet();
    //     // await styleSheet.replaceSync(cssText); // Use replace for a cleaner approach

    //     // console.log(styleSheet);

    //     if (this.shadowRoot) {
    //       this.shadowRoot.adoptedStyleSheets.push(tailwindSheet);
    //     }
    //   } catch (error) {
    //     console.error('Error loading and adopting stylesheet:', error);
    //   }
    // }
  };
