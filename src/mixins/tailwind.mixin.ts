import { CSSResultArray, LitElement } from 'lit';
import tailwindStyles from '../styles/tailwind.css?inline';
import dsStyles from '@digdir/designsystemet-css?inline';
import { Constructor } from '../types/mixin-constructor';

export const styled = <T extends Constructor<LitElement>>(
  superClass: T,
  elementCss: CSSResultArray = []
): T =>
  class extends superClass {
    /**
     * @ignore
     */
    static styles = [tailwindStyles, dsStyles, elementCss];
  };
