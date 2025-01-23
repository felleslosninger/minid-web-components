import { CSSResultArray, LitElement, unsafeCSS } from 'lit';
import tailwindStyles from '../styles/tailwind.css?inline';
import dsStyles from '@digdir/designsystemet-css?inline';
import { Constructor } from '../types/mixin-constructor';

export const tailwindCssStyles = unsafeCSS(tailwindStyles);
export const dsCssStyles = unsafeCSS(dsStyles);

export const styled = <T extends Constructor<LitElement>>(
  superClass: T,
  elementCss: CSSResultArray = []
): T =>
  class extends superClass {
    /**
     * @ignore
     */
    static styles = [
      tailwindCssStyles,
      dsCssStyles,
      elementCss,
    ] satisfies CSSResultArray;
  };

export class MinidElement extends LitElement {
  static override styles = [
    tailwindCssStyles,
    dsCssStyles,
  ] satisfies CSSResultArray;
}
