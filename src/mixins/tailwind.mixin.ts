import { type CSSResultArray, LitElement } from 'lit';
import type { Constructor } from '../types/mixin-constructor';

const tailwindSheet = new CSSStyleSheet();

export const styled = <T extends Constructor<LitElement>>(
  superClass: T,
  elementCss: CSSResultArray = []
): T =>
  class extends superClass {
    /**
     * @ignore
     */
    static styles = [tailwindSheet, elementCss];
    /**
     * @ignore
     */
    private tailwindLinkElement: HTMLStyleElement;

    constructor(..._: any[]) {
      super();
      this.tailwindLinkElement = document.querySelector(
        '[data-mid-tailwind]'
      ) as HTMLStyleElement;
    }

    connectedCallback(): void {
      super.connectedCallback();

      if (tailwindSheet.cssRules.length) {
        return;
      }

      if (!this.tailwindLinkElement) {
        return;
      }

      this.tailwindLinkElement.addEventListener('load', () => {
        if (tailwindSheet.cssRules.length) {
          return;
        }

        this.insertCssRules();
      });

      // Handle cases where the stylesheet might already be in the cache
      this.insertCssRules();
    }

    private insertCssRules() {
      if (this.tailwindLinkElement.sheet) {
        Array.from(this.tailwindLinkElement.sheet.cssRules).forEach((rule) => {
          try {
            tailwindSheet.insertRule(
              rule.cssText,
              tailwindSheet.cssRules.length
            );
          } catch (error) {
            console.warn('Error inserting rule:', rule.cssText, error);
          }
        });
      } else {
        console.warn(
          'Error getting css stylesheet from element with id "tailwind-styles"'
        );
      }
    }
  };
