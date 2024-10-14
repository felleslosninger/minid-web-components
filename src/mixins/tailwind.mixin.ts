import { CSSResultArray, LitElement, unsafeCSS } from 'lit';
import tailwindStyles from '../tailwind.css?inline';
import dsTheme from '@digdir/designsystemet-theme?inline';
import dsStyles from '@digdir/designsystemet-css?inline';

export const tailwindCssStyles = unsafeCSS(tailwindStyles);
export const dsCssTheme = unsafeCSS(dsTheme.replace(/:root/g, ':host'));
export const dsCssStyles = unsafeCSS(dsStyles);

export const tailwind = <T extends Constructor<LitElement>>(superClass: T) =>
  class extends superClass {
    static styles = [
      tailwindCssStyles,
      dsCssStyles,
      dsCssTheme,
    ] as CSSResultArray;
  };

type Constructor<T = {}> = new (...args: any[]) => T;

export class MinidElement extends LitElement {

  static override styles = [
    tailwindCssStyles,
    dsCssStyles,
    dsCssTheme,
  ] as CSSResultArray;


}
