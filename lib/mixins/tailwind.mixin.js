import { LitElement, unsafeCSS } from 'lit';
import tailwindStyles from '../css/tailwind.css?inline';
export const tailwindCssStyles = unsafeCSS(tailwindStyles);
export const tailwind = (superClass) => class extends superClass {
    static { this.styles = [tailwindCssStyles]; }
};
export class TailwindLitElement extends LitElement {
    static { this.styles = [tailwindCssStyles]; }
}
export class MinidElement extends LitElement {
    static { this.styles = []; }
}
