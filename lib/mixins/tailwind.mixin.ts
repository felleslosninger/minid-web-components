import { CSSResultArray, LitElement, unsafeCSS } from 'lit';
import tailwindStyles from '../css/tailwind.css?inline';

export const tailwindCssStyles = unsafeCSS(tailwindStyles);

export const tailwind = <T extends Constructor<LitElement>>(superClass: T) =>
  class extends superClass {
    static styles = [tailwindCssStyles];
  };

type Constructor<T = {}> = new (...args: any[]) => T;

export class TailwindLitElement extends LitElement {
  static override styles = [tailwindCssStyles];
}

export class MinidElement extends LitElement {
  static override styles = [
  ] as CSSResultArray;
}
