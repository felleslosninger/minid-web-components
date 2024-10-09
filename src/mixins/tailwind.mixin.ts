import { CSSResultArray, LitElement, unsafeCSS } from 'lit';
import tailwindStyles from '../tailwind.css?inline';
import dsStyles from '@digdir/designsystemet-css?inline';
import dsTheme from '@digdir/designsystemet-theme?inline';

export const tailwindCssStyles = unsafeCSS(tailwindStyles);
export const dsCssStyles = unsafeCSS(dsStyles);
export const dsCssTheme = unsafeCSS(dsTheme);

export const tailwind = <T extends Constructor<LitElement>>(superClass: T) =>
  class extends superClass {
    static styles = [
      tailwindCssStyles,
      dsCssStyles,
      dsCssTheme
    ] as CSSResultArray;
  };

type Constructor<T = {}> = new (...args: any[]) => T;

export class MinidElement extends LitElement {
  static override styles = [
    tailwindCssStyles,
    dsCssStyles,
    dsCssTheme
  ] as CSSResultArray;
}
