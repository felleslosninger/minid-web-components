import { css, CSSResultArray, CSSResultOrNative, LitElement } from 'lit';
import { Constructor } from '../types/mixin-constructor';
import baseDsStyles from '@digdir/designsystemet-css/base.css?inline';

export const styled = <T extends Constructor<LitElement>>(
  superClass: T,
  elementCss: Array<CSSResultOrNative | CSSResultArray | string> = []
): T =>
  class extends superClass {
    /**
     * @ignore
     */
    static styles = [
      css`
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          margin: 0;
          padding: 0;
        }

        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          box-sizing: border-box;
          border: 0 solid;
        }

        button,
        input,
        select,
        optgroup,
        textarea,
        ::file-selector-button {
          font: inherit;
          font-feature-settings: inherit;
          font-variation-settings: inherit;
          letter-spacing: inherit;
          color: inherit;
          border-radius: 0;
          background-color: transparent;
          opacity: 1;
        }
      `,
      baseDsStyles,
      elementCss,
    ];
  };
