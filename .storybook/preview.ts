import type { Preview } from '@storybook/web-components-vite';
import { setCustomElementsManifest } from '@storybook/web-components-vite';
import customElements from '../custom-elements.json';
import '../src/styles/global.css';
import '../src/styles/vendor.css';

setCustomElementsManifest(customElements);

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Introduction', 'Styling', '*'],
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
        transform: (source) => source.replace(/=\"\"/g, ''), // Remove ="" on boolean attributes
      },
    },
  },
  tags: ['autodocs', '!dev'],
};

export default preview;
