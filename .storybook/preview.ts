import type { Preview } from '@storybook/web-components-vite';
import { setCustomElementsManifest } from '@storybook/web-components-vite';
import customElements from '../custom-elements.json';
import { within as withinShadow } from 'shadow-dom-testing-library';
import '../src/styles/global.css';
import '../src/styles/vendor.css';

setCustomElementsManifest(customElements);

const preview: Preview = {
  beforeEach({ canvasElement, canvas }) {
    Object.assign(canvas, { ...withinShadow(canvasElement) });
  },
  parameters: {
    options: {
      storySort: {
        order: [
          'About',
          'Installation',
          'Usage',
          'Form Controls',
          'Styling',
          '*',
        ],
      },
    },
    controls: {
      exclude:
        /(_.*|#.*|internals|validationMessage|validity|styles|[a-z][A-Z]+)/, // exclude private props
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: {
        format: true,
        excludeDecorators: true,
        transform: (source: any) => source.replace(/=\"\"/g, ''), // Remove ="" on boolean attributes
      },
    },
    a11y: {
      // Optional selector to inspect
      context: 'body',
      test: 'error',
      /*
       * Axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {},
    },
  },
  tags: ['autodocs'],
};

export type ShadowQueries = ReturnType<typeof withinShadow>;

declare module 'storybook/internal/csf' {
  interface Canvas extends ShadowQueries {}
}

export default preview;
