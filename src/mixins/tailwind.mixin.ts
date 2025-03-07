import { CSSResultArray, CSSResultOrNative, LitElement } from 'lit';
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
    static styles = [baseDsStyles, elementCss];
  };
