import { CSSResultArray, LitElement } from 'lit';
import tailwindStyles from '../styles/component-tailwind.css?inline';
import { Constructor } from '../types/mixin-constructor';

export const styled = <T extends Constructor<LitElement>>(
  superClass: T,
  elementCss: CSSResultArray = []
): T =>
  class extends superClass {
    /**
     * @ignore
     */
    static styles = [tailwindStyles, elementCss];
  };
