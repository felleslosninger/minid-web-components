import {
  CSSResultArray,
  LitElement,
  // PropertyDeclaration,
  unsafeCSS,
} from 'lit';
import tailwindStyles from '../tailwind.css?inline';
import dsTheme from '@digdir/designsystemet-theme?inline';
import dsStyles from '@digdir/designsystemet-css?inline';

export const tailwindCssStyles = unsafeCSS(tailwindStyles);
export const dsCssTheme = unsafeCSS(dsTheme.replace(/:root/g, ':host'));
export const dsCssStyles = unsafeCSS(dsStyles);

// const kebabize = (str: string) =>
//   str.replace(
//     /[A-Z]+(?![a-z])|[A-Z]/g,
//     ($, ofs) => (ofs ? '-' : '') + $.toLowerCase()
//   );

export const styled = <T extends Constructor<LitElement>>(
  superClass: T,
  elementCss: CSSResultArray = []
): T =>
  class extends superClass {
    static styles = [
      elementCss,
      tailwindCssStyles,
      dsCssStyles,
      dsCssTheme,
    ] satisfies CSSResultArray;

    // static createProperty(name: PropertyKey, options: PropertyDeclaration) {
    //   let customOptions = options;

    //   // derive the attribute name if not already defined or disabled
    //   if (
    //     typeof options?.attribute === 'undefined' ||
    //     options?.attribute === true
    //   ) {
    //     customOptions = Object.assign({}, options, {
    //       attribute: kebabize(name.toString()),
    //     });
    //   }

    //   // invoke the original method with the custom options to let LitElement do its thing
    //   super.createProperty(name, customOptions);
    // }
  };

type Constructor<T = {}> = new (...args: any[]) => T;

export class MinidElement extends LitElement {
  static override styles = [
    tailwindCssStyles,
    dsCssStyles,
    dsCssTheme,
  ] satisfies CSSResultArray;
}
