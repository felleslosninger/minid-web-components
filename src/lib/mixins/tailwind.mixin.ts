import { LitElement, unsafeCSS } from 'lit';
import tailwindStyles from 'src/lib/tailwind.css?inline';
import style from '@digdir/designsystemet-css?inline';
import theme from '@digdir/designsystemet-theme?inline';

export const tailwindCssStyles = unsafeCSS(tailwindStyles);
export const digdirStyles = unsafeCSS(style);
export const digdirTheme = unsafeCSS(theme);

export const tailwind = <T extends Constructor<LitElement>>(superClass: T) =>
  class extends superClass {
    static styles = [tailwindCssStyles, digdirStyles, digdirTheme];
  };

type Constructor<T = {}> = new (...args: any[]) => T;

export class TailwindLitElement extends LitElement {
  static override styles = [tailwindCssStyles];
}
